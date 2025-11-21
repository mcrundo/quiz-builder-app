"""Default values and constants for the question parser."""

from typing import Literal

# Valid choice labels
LABEL_CHOICES: tuple[str, ...] = ("A", "B", "C", "D")
LabelType = Literal["A", "B", "C", "D"]

# Number of choices required per question
CHOICES_PER_QUESTION = 4
