.PHONY: help install install-dev test coverage format lint typecheck check clean

help:
	@echo "Quiz Builder - Python Parser"
	@echo ""
	@echo "Available commands:"
	@echo "  make install        Install production dependencies"
	@echo "  make install-dev    Install development dependencies"
	@echo "  make test          Run tests"
	@echo "  make coverage      Run tests with coverage report"
	@echo "  make format        Format code with black"
	@echo "  make lint          Lint code with ruff"
	@echo "  make typecheck     Type check with mypy"
	@echo "  make check         Run all checks (format, lint, typecheck, test)"
	@echo "  make clean         Remove build artifacts and cache files"

install:
	pip install -r requirements.txt
	pip install -e .

install-dev:
	pip install -r requirements-dev.txt
	pip install -e .

test:
	pytest

coverage:
	pytest --cov=question_parser --cov-report=html --cov-report=term
	@echo "Coverage report generated in htmlcov/index.html"

format:
	black src tests

lint:
	ruff check src tests

typecheck:
	mypy src

check: format lint typecheck test
	@echo "All checks passed!"

clean:
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf .ruff_cache/
	rm -rf htmlcov/
	rm -rf .coverage
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	@echo "Cleaned build artifacts and cache files"
