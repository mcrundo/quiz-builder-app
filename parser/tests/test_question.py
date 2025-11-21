"""Tests for the Question model."""

import pytest
from pydantic import ValidationError

from question_parser.defaults import CHOICES_PER_QUESTION
from question_parser.models import Choice, Question


def test_question_valid(valid_question: Question) -> None:
    """Test creating a valid Question."""
    assert valid_question.id == 1
    assert valid_question.text == "What is the capital of France?"
    assert len(valid_question.choices) == CHOICES_PER_QUESTION


def test_question_immutable(valid_question: Question) -> None:
    """Test that Question is immutable."""
    with pytest.raises(ValueError):
        valid_question.text = "New text"  # type: ignore[misc]


def test_question_id_positive(valid_choices: list[Choice]) -> None:
    """Test that question ID must be positive."""
    with pytest.raises(ValueError, match="Question ID must be positive"):
        Question(id=0, text="Question text", choices=valid_choices)


def test_question_empty_text(valid_choices: list[Choice]) -> None:
    """Test that question text cannot be empty."""
    with pytest.raises(ValueError, match="Question text cannot be empty"):
        Question(id=1, text="", choices=valid_choices)


def test_question_wrong_choice_count(valid_choices: list[Choice]) -> None:
    """Test that question must have correct number of choices."""
    with pytest.raises(ValueError, match=f"Question must have {CHOICES_PER_QUESTION} choices"):
        Question(id=1, text="Question text", choices=valid_choices[:2])


def test_question_invalid_labels(valid_choices: list[Choice]) -> None:
    """Test that question choices must have valid labels."""
    # Duplicate A label (missing B)
    invalid_choices = [
        Choice(label="A", text="First"),
        Choice(label="A", text="Second"),
        Choice(label="C", text="Third"),
        Choice(label="D", text="Fourth"),
    ]
    with pytest.raises(ValidationError):
        Question(id=1, text="Question text", choices=invalid_choices)
