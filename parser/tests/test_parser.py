"""Tests for the QuestionParser."""

import pytest

from question_parser.defaults import CHOICES_PER_QUESTION
from question_parser.errors import ParsingError
from question_parser.parser import QuestionParser


def test_parse_valid_quiz(parser: QuestionParser, valid_quiz_paragraphs: list[str]) -> None:
    """Test parsing a valid quiz with multiple questions."""
    quiz = parser.parse(valid_quiz_paragraphs)

    assert len(quiz.questions) == 2
    assert quiz.questions[0].id == 1
    assert quiz.questions[0].text == "What is the capital of France?"
    assert len(quiz.questions[0].choices) == CHOICES_PER_QUESTION
    assert quiz.questions[1].id == 2


def test_parse_multiline_question_text(parser: QuestionParser) -> None:
    """Test parsing question with multiple lines of text."""
    paragraphs = [
        "Question 1",
        "What is the capital",
        "of France?",
        "A. Paris",
        "B. London",
        "C. Berlin",
        "D. Madrid",
    ]

    quiz = parser.parse(paragraphs)

    assert quiz.questions[0].text == "What is the capital\nof France?"


def test_parse_empty_paragraphs(parser: QuestionParser) -> None:
    """Test that empty paragraph list raises error."""
    with pytest.raises(ParsingError, match="No paragraphs to parse"):
        parser.parse([])


def test_parse_no_questions(parser: QuestionParser) -> None:
    """Test that paragraphs with no questions raises error."""
    paragraphs = ["Some random text", "More text"]

    with pytest.raises(ParsingError, match="No valid questions found"):
        parser.parse(paragraphs)


def test_parse_missing_choices(parser: QuestionParser) -> None:
    """Test that question with wrong number of choices raises error."""
    paragraphs = [
        "Question 1",
        "What is the capital of France?",
        "A. Paris",
        "B. London",
        # Missing C and D
    ]

    with pytest.raises(ParsingError, match=f"has 2 choices, expected {CHOICES_PER_QUESTION}"):
        parser.parse(paragraphs)


def test_parse_invalid_labels(parser: QuestionParser) -> None:
    """Test that question with wrong labels raises error."""
    paragraphs = [
        "Question 1",
        "Question text",
        "A. Choice A",
        "A. Duplicate A",  # Duplicate label
        "C. Choice C",
        "D. Choice D",
    ]

    with pytest.raises(ParsingError, match="has invalid labels"):
        parser.parse(paragraphs)


def test_parse_question_no_text(parser: QuestionParser) -> None:
    """Test that question without text raises error."""
    paragraphs = [
        "Question 1",
        "A. Paris",  # No question text before choices
        "B. London",
        "C. Berlin",
        "D. Madrid",
    ]

    with pytest.raises(ParsingError, match="Question 1 has no text"):
        parser.parse(paragraphs)


def test_parse_skips_non_question_text(parser: QuestionParser) -> None:
    """Test that parser skips text that isn't part of questions."""
    paragraphs = [
        "Some intro text",
        "Question 1",
        "What is 1 + 1?",
        "A. 1",
        "B. 2",
        "C. 3",
        "D. 4",
        "Some footer text",
    ]

    quiz = parser.parse(paragraphs)

    # Should only parse the one valid question
    assert len(quiz.questions) == 1
    assert quiz.questions[0].id == 1


def test_parse_unlabeled_choices(parser: QuestionParser) -> None:
    """Test parsing questions with unlabeled choices."""
    paragraphs = [
        "Question 1",
        "What color is the sky?",
        "Blue",
        "Purple",
        "Green",
        "Red",
    ]

    quiz = parser.parse(paragraphs)

    assert len(quiz.questions) == 1
    assert quiz.questions[0].text == "What color is the sky?"
    assert len(quiz.questions[0].choices) == CHOICES_PER_QUESTION
    assert quiz.questions[0].choices[0].label == "A"
    assert quiz.questions[0].choices[0].text == "Blue"
    assert quiz.questions[0].choices[3].label == "D"
    assert quiz.questions[0].choices[3].text == "Red"


def test_parse_multiple_unlabeled_questions(parser: QuestionParser) -> None:
    """Test parsing multiple questions with unlabeled choices."""
    paragraphs = [
        "Question 1",
        "What is 2 + 2?",
        "3",
        "4",
        "5",
        "6",
        "Question 2",
        "What is the capital?",
        "Paris",
        "London",
        "Berlin",
        "Madrid",
    ]

    quiz = parser.parse(paragraphs)

    assert len(quiz.questions) == 2
    assert quiz.questions[0].choices[1].label == "B"
    assert quiz.questions[0].choices[1].text == "4"
    assert quiz.questions[1].choices[0].label == "A"
    assert quiz.questions[1].choices[0].text == "Paris"
