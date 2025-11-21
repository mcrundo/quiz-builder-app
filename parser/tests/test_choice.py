"""Tests for the Choice model."""

import pytest

from question_parser.models import Choice


def test_choice_valid(valid_choice_a: Choice) -> None:
    """Test creating a valid Choice."""
    assert valid_choice_a.label == "A"
    assert valid_choice_a.text == "Paris"


def test_choice_immutable(valid_choice_a: Choice) -> None:
    """Test that Choice is immutable."""
    with pytest.raises(ValueError):
        valid_choice_a.text = "Rome"  # type: ignore[misc]


def test_choice_empty_text() -> None:
    """Test that empty text raises error."""
    with pytest.raises(ValueError, match="Choice text cannot be empty"):
        Choice(label="A", text="")


def test_choice_whitespace_text() -> None:
    """Test that whitespace-only text raises error."""
    with pytest.raises(ValueError, match="Choice text cannot be empty"):
        Choice(label="A", text="   ")
