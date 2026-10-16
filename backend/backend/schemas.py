from enum import Enum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StrictBool


class ActionType(str, Enum):
    BUTTON_PRESS = "button_press"
    TEXT_INPUT = "text_input"          # Shutdown-Befehle, Passwörter, ASCII/Binary-Antworten


# Strings: nicht leer, begrenzte Länge, keine stille Umwandlung (z. B. 1 -> True)
ShortStr = Annotated[str, Field(min_length=1, max_length=128, strict=True)]


class PlayerInput(BaseModel):
    model_config = ConfigDict(extra="forbid")   # unbekannte Felder (z. B. "admin") ablehnen

    action_type: ActionType
    target: ShortStr
    value: ShortStr | StrictBool