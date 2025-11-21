"""Shared test fixtures and configuration."""

import pytest

from question_parser.defaults import LABEL_CHOICES
from question_parser.models import Choice, Question, Quiz


@pytest.fixture
def valid_choice_a() -> Choice:
    """A valid Choice with label A."""
    return Choice(label="A", text="Paris")


@pytest.fixture
def valid_choice_b() -> Choice:
    """A valid Choice with label B."""
    return Choice(label="B", text="London")


@pytest.fixture
def valid_choice_c() -> Choice:
    """A valid Choice with label C."""
    return Choice(label="C", text="Berlin")


@pytest.fixture
def valid_choice_d() -> Choice:
    """A valid Choice with label D."""
    return Choice(label="D", text="Madrid")


@pytest.fixture
def all_labels() -> tuple[str, ...]:
    """All valid choice labels."""
    return LABEL_CHOICES


@pytest.fixture
def valid_choices(
    valid_choice_a: Choice,
    valid_choice_b: Choice,
    valid_choice_c: Choice,
    valid_choice_d: Choice,
) -> list[Choice]:
    """A valid list of 4 choices with A-D labels."""
    return [valid_choice_a, valid_choice_b, valid_choice_c, valid_choice_d]


@pytest.fixture
def valid_question(valid_choices: list[Choice]) -> Question:
    """A valid Question."""
    return Question(id=1, text="What is the capital of France?", choices=valid_choices)


@pytest.fixture
def valid_question_2(valid_choices: list[Choice]) -> Question:
    """A second valid Question with ID 2."""
    return Question(id=2, text="What is 2 + 2?", choices=valid_choices)


@pytest.fixture
def valid_quiz(valid_question: Question, valid_question_2: Question) -> Quiz:
    """A valid Quiz with sequential questions."""
    return Quiz(questions=[valid_question, valid_question_2])
