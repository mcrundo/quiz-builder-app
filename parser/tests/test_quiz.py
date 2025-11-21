"""Tests for the Quiz model."""

import json

import pytest
from pydantic import ValidationError

from question_parser.defaults import QUESTION_ID_START, QUIZ_VERSION
from question_parser.models import Question, Quiz


def test_quiz_valid(valid_quiz: Quiz) -> None:
    """Test creating a valid Quiz."""
    assert valid_quiz.version == QUIZ_VERSION
    assert len(valid_quiz.questions) == 2
    assert valid_quiz.questions[0].id == QUESTION_ID_START
    assert valid_quiz.questions[1].id == QUESTION_ID_START + 1


def test_quiz_immutable(valid_quiz: Quiz) -> None:
    """Test that Quiz is immutable."""
    with pytest.raises(ValueError):
        valid_quiz.version = "2.0"  # type: ignore[misc]


def test_quiz_empty_questions(valid_question: Question) -> None:
    """Test that quiz must have at least one question."""
    with pytest.raises(ValidationError, match="Quiz must have at least one question"):
        Quiz(questions=[])


def test_quiz_non_sequential_ids(valid_question: Question, valid_question_2: Question) -> None:
    """Test that question IDs must be sequential."""
    question_3 = Question(
        id=5, text="Skipped ID", choices=valid_question.choices  # Should be 3, not 5
    )
    with pytest.raises(ValidationError, match="Question IDs must be sequential"):
        Quiz(questions=[valid_question, valid_question_2, question_3])


def test_quiz_wrong_start_id(valid_question_2: Question) -> None:
    """Test that question IDs must start from configured start value."""
    with pytest.raises(ValidationError, match=f"starting from {QUESTION_ID_START}"):
        Quiz(questions=[valid_question_2])  # Starts at 2, not configured start


def test_quiz_json_serialization(valid_quiz: Quiz) -> None:
    """Test that Quiz can be serialized to JSON."""
    json_str = valid_quiz.model_dump_json()
    data = json.loads(json_str)

    assert data["version"] == QUIZ_VERSION
    assert len(data["questions"]) == 2
    assert data["questions"][0]["id"] == QUESTION_ID_START
    assert data["questions"][0]["text"] == "What is the capital of France?"
    assert len(data["questions"][0]["choices"]) == 4
