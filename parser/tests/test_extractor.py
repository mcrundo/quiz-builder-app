"""Tests for the DocxExtractor."""

from pathlib import Path

import pytest

from question_parser.extractor import DocxExtractor

FIXTURES_DIR = Path(__file__).parent / "fixtures"


def test_extract_valid_quiz() -> None:
    """Test extracting paragraphs from a valid quiz DOCX."""
    extractor = DocxExtractor()
    paragraphs = extractor.extract(FIXTURES_DIR / "valid_quiz.docx")

    # Should have all non-empty paragraphs
    assert len(paragraphs) == 12
    assert paragraphs[0] == "Question 1"
    assert paragraphs[1] == "What is the capital of France?"
    assert paragraphs[2] == "A. London"


def test_extract_filters_empty_paragraphs() -> None:
    """Test that empty and whitespace-only paragraphs are filtered."""
    extractor = DocxExtractor()
    paragraphs = extractor.extract(FIXTURES_DIR / "with_empty_paragraphs.docx")

    # Should only have the 2 non-empty lines
    assert len(paragraphs) == 2
    assert paragraphs == ["Line 1", "Line 2"]


def test_extract_file_not_found() -> None:
    """Test that FileNotFoundError is raised for missing files."""
    extractor = DocxExtractor()

    with pytest.raises(FileNotFoundError, match="File not found"):
        extractor.extract("nonexistent.docx")


def test_extract_invalid_docx(tmp_path: Path) -> None:
    """Test that ValueError is raised for invalid DOCX files."""
    # Create a non-DOCX file
    invalid_file = tmp_path / "invalid.docx"
    invalid_file.write_text("Not a valid DOCX file")

    extractor = DocxExtractor()

    with pytest.raises(ValueError, match="Invalid DOCX file"):
        extractor.extract(invalid_file)


def test_extract_sample_document() -> None:
    """Test extraction of the sample document and show what we extract."""
    extractor = DocxExtractor()
    # sample-data is at repo root, not in parser/
    sample_path = Path(__file__).parent.parent.parent / "sample-data" / "SAMPLE-DOCUMENT.docx"
    paragraphs = extractor.extract(sample_path)

    # Should have extracted paragraphs
    assert len(paragraphs) > 0

    # Print what we actually extracted for inspection
    print("\n" + "=" * 80)
    print("SAMPLE-DOCUMENT.docx extraction:")
    print("=" * 80)
    for i in range(min(20, len(paragraphs))):
        marker = ""
        if paragraphs[i].startswith("Question "):
            marker = " [QUESTION HEADER]"
        elif paragraphs[i].startswith(("A. ", "B. ", "C. ", "D. ")):
            marker = " [LABELED CHOICE]"
        print(f"{i:3d}: {paragraphs[i]}{marker}")
    print("=" * 80 + "\n")
