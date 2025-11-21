"""Data models for quiz questions and choices."""

from pydantic import BaseModel, ConfigDict, field_validator

from question_parser.defaults import LabelType


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
