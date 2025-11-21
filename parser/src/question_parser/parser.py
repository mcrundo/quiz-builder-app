"""Parse paragraphs into Question and Quiz objects."""

import re

from question_parser.defaults import (
    CHOICES_PER_QUESTION,
    LABEL_CHOICES,
    QUESTION_KEYWORD,
)
from question_parser.errors import ParsingError
from question_parser.models import Choice, Question, Quiz


class QuestionParser:
    """Parse text paragraphs into structured Question and Quiz objects."""

    def __init__(self) -> None:
        """Initialize parser with dynamic regex patterns based on configuration."""
        self.question_pattern = re.compile(rf"^{QUESTION_KEYWORD}\s+(\d+)$")
        labels = "|".join(LABEL_CHOICES)
        self.choice_pattern = re.compile(rf"^({labels})\.\s+(.+)$")

    def parse(self, paragraphs: list[str]) -> Quiz:
        """Parse paragraphs into a Quiz.

        Args:
            paragraphs: List of paragraph strings from document

        Returns:
            Quiz object with parsed questions

        Raises:
            ParsingError: If parsing fails due to invalid format
        """
        if not paragraphs:
            raise ParsingError("No paragraphs to parse")

        questions = self.parse_all_questions(paragraphs)

        if not questions:
            raise ParsingError("No valid questions found")

        return Quiz(questions=questions)

    def parse_all_questions(self, paragraphs: list[str]) -> list[Question]:
        """Parse all questions from paragraphs.

        Args:
            paragraphs: List of paragraph strings

        Returns:
            List of parsed Question objects
        """
        questions: list[Question] = []
        i = 0

        while i < len(paragraphs):
            match = self.question_pattern.match(paragraphs[i])
            if match:
                question_id = int(match.group(1))
                question, lines_consumed = self._parse_question(paragraphs[i:], question_id)
                questions.append(question)
                i += lines_consumed
            else:
                i += 1

        return questions

    def _parse_question(self, paragraphs: list[str], question_id: int) -> tuple[Question, int]:
        """Parse a single question starting from the 'Question N' line.

        Args:
            paragraphs: List starting with 'Question N'
            question_id: The question number from the header

        Returns:
            Tuple of (Question object, number of lines consumed)

        Raises:
            ParsingError: If question format is invalid
        """
        if len(paragraphs) < 2:
            raise ParsingError(f"Question {question_id} has no text")

        question_text, text_end = self._parse_question_text(paragraphs, question_id)
        choices = self._parse_choices(paragraphs, text_end, question_id)
        self._validate_choices(choices, question_id)

        question = Question(id=question_id, text=question_text, choices=choices)

        # Total lines consumed: text lines + choice lines
        lines_consumed = text_end + len(choices)
        return question, lines_consumed

    def _parse_question_text(self, paragraphs: list[str], question_id: int) -> tuple[str, int]:
        """Parse question text between 'Question N' and first choice.

        For labeled choices (A. text), stops at first labeled choice.
        For unlabeled choices, assumes question text is just the first line after 'Question N'.

        Args:
            paragraphs: List starting with 'Question N'
            question_id: The question number for error messages

        Returns:
            Tuple of (question text, index of first choice)

        Raises:
            ParsingError: If no text found before choices
        """
        if len(paragraphs) < 2:
            raise ParsingError(f"Question {question_id} has no text")

        text_lines = []
        i = 1  # Start after "Question N"

        # Collect lines until we hit a labeled choice
        while i < len(paragraphs) and not self.choice_pattern.match(paragraphs[i]):
            text_lines.append(paragraphs[i])
            i += 1

        if not text_lines:
            raise ParsingError(f"Question {question_id} has no text")

        # If we found labeled choices, we're done
        if i < len(paragraphs) and self.choice_pattern.match(paragraphs[i]):
            question_text = "\n".join(text_lines)
            return question_text, i

        # No labeled choices found - assume only first line is question text
        # and rest are unlabeled choices
        question_text = text_lines[0]
        return question_text, 2  # Index 2 = first line after question text

    def _parse_choices(
        self, paragraphs: list[str], start_index: int, question_id: int
    ) -> list[Choice]:
        """Parse choice options starting from given index.

        Supports both labeled format (A. text) and unlabeled format (text).
        When unlabeled, automatically assigns A, B, C, D labels.

        Args:
            paragraphs: List of paragraphs
            start_index: Index to start parsing choices from
            question_id: The question number for error messages

        Returns:
            List of Choice objects

        Raises:
            ParsingError: If wrong number of choices found
        """
        choices: list[Choice] = []
        i = start_index

        # Try parsing labeled choices first
        while i < len(paragraphs) and len(choices) < CHOICES_PER_QUESTION:
            match = self.choice_pattern.match(paragraphs[i])
            if match:
                label = match.group(1)
                text = match.group(2)
                choices.append(Choice(label=label, text=text))  # type: ignore[arg-type]
                i += 1
            else:
                break

        # If no labeled choices found, try parsing unlabeled choices
        if not choices:
            i = start_index
            while i < len(paragraphs) and len(choices) < CHOICES_PER_QUESTION:
                # Stop if we hit another question or empty line
                if self.question_pattern.match(paragraphs[i]) or not paragraphs[i].strip():
                    break

                label = LABEL_CHOICES[len(choices)]
                text = paragraphs[i].strip()
                choices.append(Choice(label=label, text=text))  # type: ignore[arg-type]
                i += 1

        if len(choices) != CHOICES_PER_QUESTION:
            raise ParsingError(
                f"Question {question_id} has {len(choices)} choices, "
                f"expected {CHOICES_PER_QUESTION}"
            )

        return choices

    def _validate_choices(self, choices: list[Choice], question_id: int) -> None:
        """Validate that all required choice labels are present.

        Args:
            choices: List of Choice objects to validate
            question_id: The question number for error messages

        Raises:
            ParsingError: If labels are missing or invalid
        """
        labels = {c.label for c in choices}
        if labels != set(LABEL_CHOICES):
            raise ParsingError(
                f"Question {question_id} has invalid labels: {sorted(labels)}, "
                f"expected {sorted(LABEL_CHOICES)}"
            )
