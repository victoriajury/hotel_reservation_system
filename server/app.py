import os

import click
from flask import Flask
from flask_restful import Api
from server.db import db
from sqlalchemy import text

from . import (
    guests,
    invoice_items,
    invoices,
    payments,
    reservation_status,
    reservations,
    room_types,
    rooms,
    special_offers,
    users,
)


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///reservations.sqlite"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)

    with app.app_context():
        db.create_all()

    api = Api(app)

    api.add_resource(users.UserResource, "/api/users")
    api.add_resource(guests.GuestResource, "/api/guests")
    api.add_resource(room_types.RoomTypeResource, "/api/room-types")
    api.add_resource(rooms.RoomResource, "/api/rooms")
    api.add_resource(reservations.ReservationResource, "/api/reservations")
    api.add_resource(
        reservation_status.ReservationStatusResource, "/api/reservation-status"
    )
    api.add_resource(special_offers.SpecialOfferResource, "/api/special-offers")
    api.add_resource(invoices.InvoiceResource, "/api/invoices")
    api.add_resource(invoice_items.InvoiceItemResource, "/api/invoice-items")
    api.add_resource(payments.PaymentResource, "/api/payments")

    # app.register_blueprint(auth.bp)

    @app.cli.command("init-db")
    def init_db(filename="dummy_data.sql"):
        """Initialize the database using schema.sql"""
        # TODO: take new file as CLI arg
        try:
            with app.open_resource(filename, "r") as f:
                sql = f.read()
                if sql:
                    confirm = input(
                        "Are you sure you want to overwrite the database? Y/N: "
                    )
                if confirm == "Y":
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
                else:
                    click.echo("🔁 No changes made to the database.")
        except Exception as e:
            click.echo(
                f"❌ Error: Database not initialized from {filename} ({repr(e)})"
            )

    return app
