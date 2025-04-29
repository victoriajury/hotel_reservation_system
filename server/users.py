from flask import jsonify, make_response, request
from flask_restful import Resource
from server.db import db
from server.models import Users


class UserResource(Resource):
    def get(self):
        query = db.session.execute(db.select(Users)).scalars()
        users = [data.to_dict() for data in query.all()]

        return jsonify(users)

    def post(self):
        form_json = request.get_json()
        new_user = Users(username=form_json["username"], email=form_json["password"])

        db.session.add(new_user)
        db.session.commit()

        response = make_response(new_user.to_dict(), 201)
        return response
