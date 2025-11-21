"""Tests for custom error classes."""

import pytest

from question_parser.errors import ParsingError, QuestionParserError


def test_base_error() -> None:
    """Test base QuestionParserError."""
    error = QuestionParserError("Something went wrong")
    assert error.message == "Something went wrong"
    assert str(error) == "Something went wrong"


def test_base_error_is_exception() -> None:
    """Test that QuestionParserError is a standard Exception."""
    error = QuestionParserError("Test")
    assert isinstance(error, Exception)


def test_parsing_error() -> None:
    """Test ParsingError for document parsing failures."""
    error = ParsingError("Invalid DOCX format")
    assert error.message == "Invalid DOCX format"
    assert isinstance(error, QuestionParserError)


def test_parsing_error_catchable_as_base() -> None:
    """Test that ParsingError can be caught as QuestionParserError."""
    with pytest.raises(QuestionParserError):
        raise ParsingError("test error")
