"""Basic smoke test to verify test setup is working."""


def test_imports() -> None:
    """Verify that the question_parser package can be imported."""
    import question_parser

    assert question_parser is not None


def test_basic_assertion() -> None:
    """Verify that pytest is working correctly."""
    assert True
    assert 1 + 1 == 2
