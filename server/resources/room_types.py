import os

from flask import current_app, jsonify, make_response, request
from flask_restful import HTTPException, Resource
from server.database import db
from server.helpers import room_image_location
from server.models import RoomTypes
from werkzeug.exceptions import NotFound
from werkzeug.utils import secure_filename

# RequestParser doesn't work for multipart/form-data with images as it expects a json object.
required_fields = [
    "type_name",
    "base_price_per_night",
    "amenities",
    "max_occupants",
    "modified_by_id",
]

type_casts = {
    "base_price_per_night": float,
    "max_occupants": int,
    "modified_by_id": int,
}

ALLOWED_EXTENSIONS = {"jpg", "jpeg"}


class RoomTypeResource(Resource):
    def get(self, room_type_id=None):
        if room_type_id is None:
            query = db.session.execute(db.select(RoomTypes)).scalars()
            room_types = [data.to_dict() for data in query.all()]

            return jsonify(room_types)
        else:
            try:
                room_type = db.get_or_404(RoomTypes, room_type_id).to_dict()
                return jsonify(room_type)
            except NotFound:
                response = make_response("Room Type not found.", 404)
                return response

    def post(self):
        try:
            fields = parse_form(
                required_fields=required_fields,
                required_files=["photo"],
                type_casts=type_casts,
            )

            photo = fields.get("photo")

            filename = secure_filename(photo.filename)
            filepath = os.path.join(
                current_app.static_folder, room_image_location(), filename
            )
            photo.save(filepath)

            new_room_type = RoomTypes(
                type_name=fields["type_name"],
                base_price_per_night=fields["base_price_per_night"],
                amenities=fields["amenities"],
                photo=filename,
                max_occupants=fields["max_occupants"],
                modified_by_id=fields["modified_by_id"],
            )

            db.session.add(new_room_type)
            db.session.commit()

            response = make_response(new_room_type.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.description, e.response)

        return response

    def put(self, room_type_id):
        try:
            room_type = db.get_or_404(RoomTypes, room_type_id)
        except NotFound:
            response = make_response("Room Type not found.", 404)
            return response

        try:
            fields = parse_form(
                required_fields=required_fields,
                required_files=["photo"],
                type_casts=type_casts,
            )

            photo = fields.get("photo")

            filename = secure_filename(photo.filename)
            filepath = os.path.join(
                current_app.static_folder, room_image_location(), filename
            )
            photo.save(filepath)

            room_type.type_name = fields["type_name"]
            room_type.base_price_per_night = fields["base_price_per_night"]
            room_type.amenities = fields["amenities"]
            room_type.photo = filename
            room_type.max_occupants = fields["max_occupants"]
            room_type.modified_by_id = fields["modified_by_id"]

            db.session.commit()

            response = make_response(room_type.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.description, e.response)

        return response

    def delete(self, room_type_id):
        try:
            room_type = db.get_or_404(RoomTypes, room_type_id)
        except NotFound:
            response = make_response("Room Type not found.", 404)
            return response

        db.session.delete(room_type)
        db.session.commit()

        response = make_response("Room Type deleted", 204)

        return response


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def parse_form(required_fields=None, required_files=None, type_casts=None):
    """
    Parses multipart/form-data and validates required fields/files.

    Args:
        required_fields (list): Form fields that must be present.
        required_files (list): File fields that must be present.
        type_casts (dict): Optional type conversion, e.g. {'price': float}.

    Returns:
        dict: Combined data with validated form fields and file objects.

    Raises:
        HTTPException: If a required field or file is missing or invalid.
    """
    data = {}

    required_fields = required_fields or []
    required_files = required_files or []
    type_casts = type_casts or {}

    # Validate and extract form fields
    for field in required_fields:
        value = request.form.get(field)
        if value is None:
            raise HTTPException(
                description=f"Missing required parameter: {field}", response=400
            )

        # Optional type casting
        if field in type_casts:
            try:
                value = type_casts[field](value)
            except (ValueError, TypeError):
                raise HTTPException(
                    description=f"Invalid value for field: {field} (expected {type_casts[field].__name__}",
                    response=400,
                )

        data[field] = value

    # Validate and extract file uploads
    for file_field in required_files:
        file = request.files.get(file_field)
        if not file or file.filename == "":
            raise HTTPException(
                description=f"Missing required file: {file_field}", response=400
            )
        if not allowed_file(file.filename):
            raise HTTPException(
                description=f"Not a valid file extension type: {file.filename}",
                response=400,
            )
        data[file_field] = file

    return data
