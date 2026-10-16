"""Task 1 – Alarm verifizieren (kind='alarm')."""
import json
import pytest
import fakeredis
from unittest.mock import patch

from backend.dataCenter import DataCenter
from backend.playableObject import ROLE_M, ROLE_P1, ROLE_P2

GAME = "t1_session"
MASTER_NAME = "Anna"
P1_NAME = "Ben"
P2_NAME = "Celim"


@pytest.fixture
def dc():
    fake = fakeredis.FakeStrictRedis()
    fake.flushall()
    with patch("backend.redis_handler.redis.Redis", return_value=fake):
        center = DataCenter(game_id=GAME)
        for name, role in ((MASTER_NAME, ROLE_M), (P1_NAME, ROLE_P1), (P2_NAME, ROLE_P2)):
            center.redis.r.hset(
                center.redis._k_players(GAME),
                name,
                json.dumps({"name": name, "role": role}),
            )
        center.start()
        center.new_task("alarm")
        yield center


def _press(dc, name, target, value):
    return dc.process_input(name, {"action_type": "button_press", "target": target, "value": value})


def _text(dc, name, target, value):
    return dc.process_input(name, {"action_type": "text_input", "target": target, "value": value})


def _state(dc):
    return dc.current_task()["state"]


def _view(dc, role):
    return dc.snapshot()["tasks"][0]["views"][role]


def test_new_task_is_alarm_with_views_for_every_role(dc):
    task = dc.current_task()
    assert task["kind"] == "alarm"
    views = dc.snapshot()["tasks"][0]["views"]
    assert set(views) >= {ROLE_M, ROLE_P1, ROLE_P2}


def test_master_sees_component_and_code(dc):
    st = _state(dc)
    master = _view(dc, ROLE_M)
    assert master["component"] == st["broken_id"]
    assert master["code"] == st["code"]


def test_p1_sees_switch_symbols(dc):
    st = _state(dc)
    p1 = _view(dc, ROLE_P1)
    assert "switches" in p1
    assert st["broken_symbol"] in p1["switches"]


def test_p2_sees_terminal_with_code_length(dc):
    st = _state(dc)
    p2 = _view(dc, ROLE_P2)
    assert p2.get("type") == "shutdown_terminal"
    assert p2["code_length"] == len(st["code"])


def test_nobody_sees_raw_state_keys_in_public_snapshot(dc):
    pub = dc.snapshot()["tasks"][0]
    assert "state" not in pub


def test_correct_switch_is_progress_and_keeps_task(dc):
    st = _state(dc)
    task_id = dc.current_task()["task_id"]

    res = _press(dc, P1_NAME, "main_switch", st["broken_symbol"])

    assert res["result"] == "correct"
    assert dc.current_task()["task_id"] == task_id
    assert dc.health == 300
    assert _state(dc)["switch_ok"] is True


def test_correct_command_is_progress_and_keeps_task(dc):
    st = _state(dc)
    task_id = dc.current_task()["task_id"]
    cmd = ",".join(st["code"])

    res = _text(dc, P2_NAME, "shutdown_cmd", cmd)

    assert res["result"] == "correct"
    assert dc.current_task()["task_id"] == task_id
    assert _state(dc)["cmd_ok"] is True


def test_both_steps_solve_task_and_heal(dc):
    st = _state(dc)
    task_id = dc.current_task()["task_id"]
    dc.redis.r.hset(dc.redis._k_state(GAME), "health", 100)
    dc.redis.r.hset(dc.redis._k_state(GAME), "time_left", 100)

    _press(dc, P1_NAME, "main_switch", st["broken_symbol"])
    res = _text(dc, P2_NAME, "shutdown_cmd", ",".join(st["code"]))

    assert res["result"] == "correct"
    assert dc.health == 115
    assert dc.current_task()["task_id"] != task_id
    assert dc.score >= 100


def test_order_does_not_matter(dc):
    st = _state(dc)
    task_id = dc.current_task()["task_id"]
    _text(dc, P2_NAME, "shutdown_cmd", ",".join(st["code"]))
    res = _press(dc, P1_NAME, "main_switch", st["broken_symbol"])
    assert res["result"] == "correct"
    assert dc.current_task()["task_id"] != task_id


def test_wrong_switch_costs_health(dc):
    res = _press(dc, P1_NAME, "main_switch", "gibt-es-nicht")
    assert res["result"] == "wrong"
    assert dc.health == 240


def test_wrong_command_costs_health(dc):
    res = _text(dc, P2_NAME, "shutdown_cmd", "FALSCH")
    assert res["result"] == "wrong"
    assert dc.health == 240


def test_master_cannot_operate_controls(dc):
    st = _state(dc)
    assert _press(dc, MASTER_NAME, "main_switch", st["broken_symbol"])["result"] == "ignored"
    assert _text(dc, MASTER_NAME, "shutdown_cmd", ",".join(st["code"]))["result"] == "ignored"
    assert dc.health == 300


def test_wrong_role_is_ignored(dc):
    st = _state(dc)
    assert _press(dc, P2_NAME, "main_switch", st["broken_symbol"])["result"] == "ignored"
    assert _text(dc, P1_NAME, "shutdown_cmd", ",".join(st["code"]))["result"] == "ignored"
    assert dc.health == 300


def test_command_alone_does_not_solve(dc):
    st = _state(dc)
    task_id = dc.current_task()["task_id"]
    _text(dc, P2_NAME, "shutdown_cmd", ",".join(st["code"]))
    assert dc.current_task()["task_id"] == task_id


def test_wrong_attempts_do_not_block_solution(dc):
    st = _state(dc)
    task_id = dc.current_task()["task_id"]
    _press(dc, P1_NAME, "main_switch", "falsch")
    _text(dc, P2_NAME, "shutdown_cmd", "falsch")
    _press(dc, P1_NAME, "main_switch", st["broken_symbol"])
    res = _text(dc, P2_NAME, "shutdown_cmd", ",".join(st["code"]))
    assert res["result"] == "correct"
    assert dc.current_task()["task_id"] != task_id