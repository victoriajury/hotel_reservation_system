import os

from flask import Flask
from flask_restful import Api
from server.db import db, init_db_command

from .resources import (
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

    api.add_resource(users.UserResource, "/api/users", endpoint="users")
    api.add_resource(users.UserResource, "/api/users/<int:user_id>", endpoint="user")

    api.add_resource(guests.GuestResource, "/api/guests", endpoint="guests")
    api.add_resource(
        guests.GuestResource, "/api/guests/<int:guest_id>", endpoint="guest"
    )

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

    app.cli.add_command(init_db_command)

    return app
