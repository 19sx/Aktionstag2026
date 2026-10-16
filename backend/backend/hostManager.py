from backend.gameLoop import start_game_for


class HostManager:
    """MVP: Host = wer den Start auslöst. Host-Check ist bewusst noch nicht drin."""

    async def start(self, game_id: str) -> str:
        return await start_game_for(game_id)