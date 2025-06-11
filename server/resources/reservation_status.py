from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import ReservationStatus
from werkzeug.exceptions import NotFound

parser = reqparse.RequestParser()
required_fields = [
    "status",
]
for arg in required_fields:
    parser.add_argument(arg, required=True)

# optional fields
parser.add_argument("description")
parser.add_argument("bg_color")


class ReservationStatusResource(Resource):
    def get(self, status_id=None):
        if status_id is None:
            query = db.session.execute(db.select(ReservationStatus)).scalars()
            statuses = [data.to_dict() for data in query.all()]
            return jsonify(statuses)

        else:
            try:
                status = db.get_or_404(ReservationStatus, status_id).to_dict()
                return jsonify(status)
            except NotFound:
                response = make_response("Reservation Status not found.", 404)
                return response

    def post(self):
        try:
            fields = parser.parse_args()

            new_status = ReservationStatus(
                status=fields["status"],
                description=fields.get("description"),
                bg_color=fields.get("bg_color"),
            )

            db.session.add(new_status)
            db.session.commit()

            response = make_response(new_status.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def put(self, status_id):
        try:
            status = db.get_or_404(ReservationStatus, status_id)
        except NotFound:
            response = make_response("Reservation Status not found.", 404)
            return response

        try:
            fields = parser.parse_args()

            status.status = fields["status"]
            status.description = fields.get("description")
            status.bg_color = fields.get("bg_color")

            db.session.commit()

            response = make_response(status.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def delete(self, status_id):
        # TODO: Warn if there are active bookings connected to status
        try:
            status = db.get_or_404(ReservationStatus, status_id)
        except NotFound:
            response = make_response("Reservation Status not found.", 404)
            return response

        db.session.delete(status)
        db.session.commit()

        response = make_response("Reservation Status deleted", 204)

        return response
