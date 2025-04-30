import click
from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


def init_db(filename="dummy_data.sql"):
    """Initialize the database using schema.sql"""
    # TODO: take new file as CLI arg
    with current_app.open_resource(filename, "r") as f:
        sql = f.read()
        if sql:
            with db.engine.connect() as con:
                db.drop_all()
                db.create_all()
                for statement in sql.split(";"):
                    line = statement.strip()
                    if line:
                        stmt = text(line)
                        con.execute(stmt)
                con.commit()
            click.echo(f"✅ Database initialized from {filename}")


@click.command("init-db")
def init_db_command():
    """Clear the existing data and create new tables."""
    confirm = input("Are you sure you want to overwrite the database? Y/N: ")
    if confirm.lower() == "y":
        try:
            init_db()
        except Exception as e:
            click.echo(f"❌ Error: Database not initialized. {repr(e)}")
    else:
        click.echo("🔁 No changes made to the database.")
