# Quiz Builder App

A Python parser for DOCX quiz files with a Vue3 web interface.

[![CI](https://github.com/mcrundo/quiz-builder-app/actions/workflows/ci.yml/badge.svg)](https://github.com/mcrundo/quiz-builder-app/actions/workflows/ci.yml)

## Project Structure

- `parser/` - Python package for parsing DOCX quiz files into JSON
- `web/` - Vue3 web application for taking quizzes

## Parser

Command-line tool to parse DOCX quiz files and output structured JSON.

See `parser/README.md` for details.

## Web App

Interactive Vue3 quiz application that loads quiz data and persists progress to localStorage.

See `web/README.md` for details.
