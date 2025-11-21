"""Tests for the CLI."""

from pathlib import Path

from click.testing import CliRunner

from question_parser.cli import main


def test_cli_valid_file(tmp_path: Path) -> None:
    """Test CLI with valid DOCX file outputs JSON."""
    runner = CliRunner()
    input_file = Path("tests/fixtures/valid_quiz.docx")

    result = runner.invoke(main, [str(input_file)])

    assert result.exit_code == 0
    assert "What is the capital of France?" in result.output
    assert '"version": "1.0"' in result.output


def test_cli_with_output_file(tmp_path: Path) -> None:
    """Test CLI writes to output file when specified."""
    runner = CliRunner()
    input_file = Path("tests/fixtures/valid_quiz.docx")
    output_file = tmp_path / "output.json"

    result = runner.invoke(main, [str(input_file), "-o", str(output_file)])

    assert result.exit_code == 0
    assert output_file.exists()
    content = output_file.read_text()
    assert "What is the capital of France?" in content
    assert '"version": "1.0"' in content


def test_cli_file_not_found() -> None:
    """Test CLI with non-existent file fails gracefully."""
    runner = CliRunner()

    result = runner.invoke(main, ["nonexistent.docx"])

    assert result.exit_code == 2  # Click's error code for bad parameter


def test_cli_empty_document(tmp_path: Path) -> None:
    """Test CLI with document containing no questions fails gracefully."""
    runner = CliRunner()
    input_file = Path("tests/fixtures/with_empty_paragraphs.docx")

    result = runner.invoke(main, [str(input_file)])

    assert result.exit_code == 1  # Abort exit code
    assert "Error:" in result.output


def test_cli_unlabeled_choices() -> None:
    """Test CLI with unlabeled choices (like CLD assessment format)."""
    runner = CliRunner()
    input_file = Path("tests/fixtures/unlabeled_quiz.docx")

    result = runner.invoke(main, [str(input_file)])

    assert result.exit_code == 0
    assert "What color is the sky?" in result.output
    assert '"label": "A"' in result.output
    assert '"text": "Blue"' in result.output
