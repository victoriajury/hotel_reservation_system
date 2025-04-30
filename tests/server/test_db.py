import tempfile
from unittest.mock import patch

from click.testing import CliRunner
from server.database import db, init_db, init_db_command
from sqlalchemy import text


def test_init_db_confirm_yes(monkeypatch):
    """Test user inputs 'y' and init_db is called."""
    monkeypatch.setattr("builtins.input", lambda _: "y")

    with patch("server.database.init_db") as mock_init_db:
        runner = CliRunner()
        result = runner.invoke(init_db_command)

        assert result.exit_code == 0
        mock_init_db.assert_called_once()
        assert "Error" not in result.output


def test_init_db_confirm_no(monkeypatch):
    """Test user inputs 'n' and init_db is not called."""
    monkeypatch.setattr("builtins.input", lambda _: "n")

    with patch("server.database.init_db") as mock_init_db:
        runner = CliRunner()
        result = runner.invoke(init_db_command)

        mock_init_db.assert_not_called()
        assert "No changes made" in result.output


def test_init_db_creates_tables(app_no_db):
    sql_content = """
    CREATE TABLE test_table (id INTEGER PRIMARY KEY, name TEXT);
    INSERT INTO test_table (name) VALUES ('Alice');
    """

    # Use a temporary file to simulate the .sql file
    with tempfile.NamedTemporaryFile("w+", suffix=".sql") as tmp_sql:
        tmp_sql.write(sql_content)
        tmp_sql.flush()

        with app_no_db.app_context():
            init_db(tmp_sql.name)

            # Verify table and data exist
            result = db.session.execute(text("SELECT name FROM test_table")).fetchall()
            assert result == [("Alice",)]
