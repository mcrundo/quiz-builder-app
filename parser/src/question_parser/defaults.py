"""Default values and constants for the question parser."""

import json
from pathlib import Path
from typing import Literal

# Load shared configuration from project root
# Path goes: defaults.py -> question_parser -> src -> parser -> root
_CONFIG_PATH = Path(__file__).parent.parent.parent.parent / "config.json"
with open(_CONFIG_PATH, "r") as f:
    _config = json.load(f)

# Valid choice labels
LABEL_CHOICES: tuple[str, ...] = tuple(_config["LABEL_CHOICES"])
LabelType = Literal["A", "B", "C", "D"]

# Number of choices required per question
CHOICES_PER_QUESTION: int = _config["CHOICES_PER_QUESTION"]

# Quiz configuration
QUIZ_VERSION: str = _config["QUIZ_VERSION"]
QUESTION_ID_START: int = _config["QUESTION_ID_START"]

# Parsing configuration
QUESTION_KEYWORD: str = _config["QUESTION_KEYWORD"]
