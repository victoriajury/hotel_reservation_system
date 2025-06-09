from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import Guests

parser = reqparse.RequestParser()
required_fields = [
    "name",
    "email",
    "telephone",
    "address_1",
    "address_2",
    "city",
    "county",
    "postcode",
    "modified_by_id",
]
for arg in required_fields:
    parser.add_argument(arg, required=True)

# optional fields
parser.add_argument("guest_notes")


class GuestResource(Resource):
    def get(self, guest_id=None):
        if guest_id is None:
            query = db.session.execute(db.select(Guests)).scalars()
            guests = [data.to_dict() for data in query.all()]

            return jsonify(guests)
        else:
            guest = (
                db.session.execute(db.select(Guests).filter_by(id=guest_id))
                .scalar_one()
                .to_dict()
            )

            return jsonify(guest)

    def post(self):
        fields = parser.parse_args()

        try:
            new_guest = Guests(
                name=fields["name"],
                email=fields["email"],
                telephone=fields["telephone"],
                address_1=fields["address_1"],
                address_2=fields["address_2"],
                city=fields["city"],
                county=fields["county"],
                postcode=fields["postcode"],
                guest_notes=fields.get("guest_notes"),
                modified_by_id=fields["modified_by_id"],
            )

            db.session.add(new_guest)
            db.session.commit()

            response = make_response(new_guest.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.get_description(), e.code)

        return response

    def put(self, guest_id):
        fields = parser.parse_args()
        guest = db.session.execute(
            db.select(Guests).filter_by(id=guest_id)
        ).scalar_one()

        try:
            guest.name = fields["name"]
            guest.email = fields["email"]
            guest.telephone = fields["telephone"]
            guest.address_1 = fields["address_1"]
            guest.address_2 = fields["address_2"]
            guest.city = fields["city"]
            guest.county = fields["county"]
            guest.postcode = fields["postcode"]
            guest.guest_notes = fields.get("guest_notes")
            guest.modified_by_id = fields["modified_by_id"]

            db.session.commit()

            response = make_response(guest.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.get_description(), e.code)

        return response

    def delete(self, guest_id):
        # TODO: Warn if there are active bookings connected to guest
        guest = db.session.execute(
            db.select(Guests).filter_by(id=guest_id)
        ).scalar_one()

        db.session.delete(guest)
        db.session.commit()

        response = make_response("Guest deleted", 204)

        return response
