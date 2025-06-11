from flask import jsonify, make_response
from flask_restful import HTTPException, Resource, reqparse
from server.database import db
from server.models import Users
from werkzeug.exceptions import NotFound
from werkzeug.security import generate_password_hash

parser = reqparse.RequestParser()
required_fields = [
    "username",
    "password",
]
for arg in required_fields:
    parser.add_argument(arg, required=True)


class UserResource(Resource):
    def get(self, user_id=None):
        if user_id is None:
            query = db.session.execute(db.select(Users)).scalars()
            users = [data.to_dict() for data in query.all()]
            return jsonify(users)

        else:
            try:
                user = db.get_or_404(Users, user_id).to_dict()
                return jsonify(user)
            except NotFound:
                response = make_response("User not found.", 404)
                return response

    def post(self):
        try:
            fields = parser.parse_args()

            new_user = Users(
                username=fields["username"],
                password=generate_password_hash(fields["password"]),
            )

            db.session.add(new_user)
            db.session.commit()

            response = make_response(new_user.to_dict(), 201)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def put(self, user_id):
        try:
            user = db.get_or_404(Users, user_id)
        except NotFound:
            response = make_response("User not found.", 404)
            return response

        try:
            fields = parser.parse_args()

            user.username = fields["username"]
            user.password = generate_password_hash(fields["password"])

            db.session.commit()

            response = make_response(user.to_dict(), 204)

        except HTTPException as e:
            response = make_response(e.data, e.code)

        return response

    def delete(self, user_id):
        try:
            user = db.get_or_404(Users, user_id)
        except NotFound:
            response = make_response("User not found.", 404)
            return response

        db.session.delete(user)
        db.session.commit()

        response = make_response("User deleted", 204)

        return response
