# Quiz Builder Parser

Python package for parsing document files into structured JSON.

## Setup

```bash
# Using mise for Python version management
mise use python@3.12

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements-dev.txt
```

## Testing

```bash
# Run all tests
make test

# Run with coverage
make coverage

# Run all checks (formatting, linting, type checking, tests)
make check
```

## Current Features

### DOCX Extraction

Extract paragraphs from DOCX files, filtering empty content.

```bash
pytest tests/test_extractor.py::test_extract_sample_document -v -s
```

## Sample Data

The `sample-data/` directory is located one level up from the `parser/` directory and contains sample document(s).
