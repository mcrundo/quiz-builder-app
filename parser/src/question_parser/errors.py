"""Custom exceptions for the question parser."""


class QuestionParserError(Exception):
    """Base exception for all question parser errors.

    Attributes:
        message: Human-readable error description
    """

    def __init__(self, message: str) -> None:
        """Initialize the error with a message.

        Args:
            message: Human-readable error description
        """
        self.message = message
        super().__init__(message)


class ParsingError(QuestionParserError):
    """Raised when parsing a document fails.

    Examples:
        - Invalid DOCX format
        - Missing required sections
        - Malformed question structure
        - Invalid choice labels
        - Wrong number of choices
    """
