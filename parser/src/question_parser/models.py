"""Data models for quiz questions and choices."""

from pydantic import BaseModel, ConfigDict, field_validator

from question_parser.defaults import CHOICES_PER_QUESTION, LABEL_CHOICES, LabelType


class Choice(BaseModel):
    """A single answer choice for a question.

    Attributes:
        label: The choice label (ex: A)
        text: The choice text content
    """

    model_config = ConfigDict(frozen=True)

    label: LabelType
    text: str

    @field_validator("text")
    @classmethod
    def text_not_empty(cls, value: str) -> str:
        """Validate that choice text is not empty or whitespace."""
        if not value or not value.strip():
            raise ValueError("Choice text cannot be empty")
        return value


class Question(BaseModel):
    """A quiz question with multiple choice answers.

    Attributes:
        id: Unique question identifier
        text: The question text
        choices: List of answer choices
    """

    model_config = ConfigDict(frozen=True)

    id: int
    text: str
    choices: list[Choice]

    @field_validator("id")
    @classmethod
    def id_positive(cls, value: int) -> int:
        """Validate that question ID is positive."""
        if value <= 0:
            raise ValueError("Question ID must be positive")
        return value

    @field_validator("text")
    @classmethod
    def text_not_empty(cls, value: str) -> str:
        """Validate that question text is not empty or whitespace."""
        if not value or not value.strip():
            raise ValueError("Question text cannot be empty")
        return value

    @field_validator("choices")
    @classmethod
    def validate_choices(cls, value: list[Choice]) -> list[Choice]:
        """Validate that question has correct number of choices with labels."""
        if len(value) != CHOICES_PER_QUESTION:
            raise ValueError(f"Question must have {CHOICES_PER_QUESTION} choices, got {len(value)}")

        labels = {c.label for c in value}
        if labels != set(LABEL_CHOICES):
            raise ValueError(
                f"Question must have choices labeled {sorted(LABEL_CHOICES)}, "
                f"got {sorted(labels)}"
            )

        return value
