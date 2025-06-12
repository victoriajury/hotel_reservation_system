from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import Rooms
from werkzeug.exceptions import NotFound

parser = reqparse.RequestParser()
required_fields = [
    "room_number",
    "room_type",
    "modified_by_id",
]
for arg in required_fields:
    parser.add_argument(arg, type=int, required=True)


class RoomResource(Resource):
    def get(self, room_id=None):
        if room_id is None:
            query = db.session.execute(db.select(Rooms)).scalars()
            rooms = [data.to_dict() for data in query.all()]

            return jsonify(rooms)

        else:
            try:
                room = db.get_or_404(Rooms, room_id).to_dict()
                return jsonify(room)
            except NotFound:
                response = make_response("Room not found.", 404)
                return response

    def post(self):
        try:
            fields = parser.parse_args()

            new_room = Rooms(
                room_number=fields["room_number"],
                room_type=fields["room_type"],
                modified_by_id=fields["modified_by_id"],
            )

            db.session.add(new_room)
            db.session.commit()

            response = make_response(new_room.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def put(self, room_id):
        try:
            room = db.get_or_404(Rooms, room_id)
        except NotFound:
            response = make_response("Room not found.", 404)
            return response

        try:
            fields = parser.parse_args()

            room.room_number = fields["room_number"]
            room.room_type = fields["room_type"]
            room.modified_by_id = fields["modified_by_id"]

            db.session.commit()

            response = make_response(room.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def delete(self, room_id):
        # TODO: Warn if there are active bookings connected to room
        try:
            room = db.get_or_404(Rooms, room_id)
        except NotFound:
            response = make_response("Room not found.", 404)
            return response

        db.session.delete(room)
        db.session.commit()

        response = make_response("Room deleted", 204)

        return response
