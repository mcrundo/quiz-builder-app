"""Extract content from DOCX files."""

from pathlib import Path

from docx import Document
from docx.opc.exceptions import PackageNotFoundError


class DocxExtractor:
    """Extract paragraphs from DOCX files."""

    def extract(self, file_path: str | Path) -> list[str]:
        """
        Extract paragraphs from a DOCX file.

        Args:
            file_path: Path to the DOCX file.

        Returns:
            List of non-empty paragraph texts.

        Raises:
            FileNotFoundError: If the file does not exist.
            ValueError: If the file is not a valid DOCX file.
        """
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        try:
            doc = Document(str(path))
        except PackageNotFoundError as e:
            raise ValueError(f"Invalid DOCX file: {file_path}") from e

        paragraphs = []
        for para in doc.paragraphs:
            text = para.text.strip()
            if text:  # Filter out empty and whitespace-only paragraphs
                paragraphs.append(text)

        return paragraphs
