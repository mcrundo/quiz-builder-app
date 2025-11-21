"""Command-line interface for the question parser."""

from pathlib import Path

import click

from question_parser.errors import QuestionParserError
from question_parser.extractor import DocxExtractor
from question_parser.parser import QuestionParser


@click.command()
@click.argument("input_file", type=click.Path(exists=True, path_type=Path))
@click.option(
    "--output",
    "-o",
    type=click.Path(path_type=Path),
    help="Output file path (default: stdout)",
)
def main(input_file: Path, output: Path | None) -> None:
    """Parse a DOCX quiz file and output structured JSON.

    INPUT_FILE: Path to the DOCX file containing quiz questions
    """
    try:
        # Extract paragraphs from DOCX
        extractor = DocxExtractor()
        paragraphs = extractor.extract(input_file)

        # Parse paragraphs into Quiz
        parser = QuestionParser()
        quiz = parser.parse(paragraphs)

        # Output JSON
        json_output = quiz.model_dump_json()

        if output:
            output.write_text(json_output)
            click.echo(f"Quiz written to {output}", err=True)
        else:
            click.echo(json_output)

    except QuestionParserError as e:
        click.echo(f"Error: {e.message}", err=True)
        raise click.Abort() from e
    except Exception as e:
        click.echo(f"Unexpected error: {e}", err=True)
        raise click.Abort() from e


if __name__ == "__main__":
    main()
