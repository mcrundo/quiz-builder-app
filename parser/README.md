# Quiz Builder Parser

Python package for parsing document files into structured JSON format for a quiz.

## Features

- **Defaults**: Constants module to dynamically configure values like `CHOICES_PER_QUESTION` or `LABEL_CHOICES`
- **DOCX Extraction**: Read and extract paragraphs from DOCX files
- **Question Parsing**: Parse quiz questions with multiple choice answers
- **Flexible Format Support**: Handles both labeled (A. text) and unlabeled (text) choice formats
- **Data Validation**: Ensures questions have exact amount of choices with sequential IDs
- **JSON Output**: Pretty-formatted JSON ready for web applications
- **CLI Tool**: Simple command-line interface for easy usage

## Installation

```bash
# Using mise for Python version management
mise use python@3.12

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install the package
pip install -e .

# Or install development dependencies
pip install -r requirements-dev.txt
```

## Usage

### Command Line

Parse a DOCX quiz file and output JSON:

```bash
# Output to stdout
question-parser path/to/quiz.docx

# Save to file
question-parser path/to/quiz.docx -o output.json

# Example with sample data
question-parser ../sample-data/SAMPLE-DOCUMENT.docx -o quiz.json
```

### Python API

```python
from question_parser.extractor import DocxExtractor
from question_parser.parser import QuestionParser

# Extract paragraphs from DOCX
extractor = DocxExtractor()
paragraphs = extractor.extract("quiz.docx")

# Parse into structured Quiz object
parser = QuestionParser()
quiz = parser.parse(paragraphs)

# Output as JSON
json_output = quiz.model_dump_json()
```

## Output Format

The parser generates JSON with the following structure:

```json
{
  "version": "1.0",
  "questions": [
    {
      "id": 1,
      "text": "What color is the sky?",
      "choices": [
        { "label": "A", "text": "Blue" },
        { "label": "B", "text": "Purple" },
        { "label": "C", "text": "None of the above" },
        { "label": "D", "text": "It depends" }
      ]
    }
  ]
}
```

## Document Format

The parser expects documents with the following format:

- Questions marked with "Question N" headers (e.g., "Question 1", "Question 2")
- Question text immediately following the header
- Set amount of answer choices per question

Example:
```
Question 1
What color is the sky?
Blue
Purple
None of the above
It depends
```

## Development

### Running Tests

```bash
# Run all tests
make test

# Run with coverage
make coverage

# Run specific test file
pytest tests/test_parser.py -v

# Run all checks (formatting, linting, type checking, tests)
make check
```

### Project Structure

```
parser/
├── src/question_parser/
│   ├── cli.py          # Command-line interface
│   ├── extractor.py    # File extraction
│   ├── parser.py       # Question parsing logic
│   ├── models.py       # Pydantic data models
│   ├── errors.py       # Custom exceptions
│   └── defaults.py     # Configuration constants
├── tests/
│   ├── test_cli.py
│   ├── test_extractor.py
│   ├── test_parser.py
│   ├── test_models.py
│   └── fixtures/       # Test files
└── sample-data/        # Sample quiz documents (../sample-data/)
```

## Requirements

- Python 3.12+
- python-docx 1.1.0+
- pydantic 2.5.0+
- click 8.1.0+

See `requirements.txt` for full dependencies.
