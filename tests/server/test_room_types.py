from io import BytesIO
import os
import pytest
from server.database import db
from server.models import RoomTypes
from server.helpers import room_image_location


def test_get_all_room_types(client):
    response = client.get("api/room-types")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["type_name"] == "Superior Double"
    assert data[1]["type_name"] == "Classic Double"


def test_get_single_room_type(client):
    response = client.get("api/room-types/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["type_name"] == "Superior Double"


@pytest.mark.parametrize(
    "path",
    (
        "api/room-types/3",
        "api/room-types/123",
    ),
)
def test_room_type_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


# def test_index(client, auth):
#     response = client.get("/room_types/")
#     assert b'href="/auth/login"' in response.data
#     assert b"King-size bed, bath, sea views" not in response.data
#     assert b"Edit" not in response.data
#     assert response.headers["Location"] == "/auth/login"

#     auth.login()
#     response = client.get("/room_types/")
#     assert b"Log out" in response.data
#     assert b"Superior Double" in response.data
#     assert b"King-size bed, bath, sea views" in response.data
#     assert b'href="/room_types/1/update"' in response.data


def test_create_room_type(client, auth, app):
    image_filename = "test123.jpg"

    data = {
        "type_name": "Single",
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "1",
        "modified_by_id": 1,
    }
    data["photo"] = (BytesIO(b"abcdef"), image_filename)

    # auth.login()
    assert client.get("api/room-types").status_code == 200
    res = client.post("api/room-types", data=data, content_type="multipart/form-data")
    assert res.status_code == 201

    file_path = os.path.join(app.static_folder, room_image_location(), image_filename)
    assert os.path.exists(file_path), f"Expected file {file_path} not found"

    # cleanup
    if os.path.exists(file_path):
        os.remove(file_path)

    with app.app_context():
        count_query = db.func.count(RoomTypes.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_room_type_missing_fields(client, auth, app):
    image_filename = "test123.jpg"

    data = {
        # "type_name" missing,
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "1",
        "modified_by_id": 1,
    }
    data["photo"] = (BytesIO(b"abcdef"), image_filename)

    # auth.login()
    assert client.get("api/room-types").status_code == 200
    res = client.post("api/room-types", data=data, content_type="multipart/form-data")
    assert res.status_code == 400
    assert b"Missing required parameter: type_name" in res.data

    with app.app_context():
        count_query = db.func.count(RoomTypes.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_create_room_type_valid_fields_type(client, auth, app):
    image_filename = "test123.jpg"

    data = {
        "type_name": "Double Room",
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "not an int",
        "modified_by_id": 1,
    }
    data["photo"] = (BytesIO(b"abcdef"), image_filename)

    # auth.login()
    assert client.get("api/room-types").status_code == 200
    res = client.post("api/room-types", data=data, content_type="multipart/form-data")
    assert res.status_code == 400
    assert b"Invalid value for field: max_occupants" in res.data

    with app.app_context():
        count_query = db.func.count(RoomTypes.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_create_room_type_missing_image(client, auth, app):
    data = {
        "type_name": "Single",
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "1",
        "modified_by_id": 1,
    }
    data["photo"] = None

    # auth.login()
    assert client.get("api/room-types").status_code == 200
    res = client.post("api/room-types", data=data, content_type="multipart/form-data")
    assert res.status_code == 400
    assert b"Missing required file: photo" in res.data


def test_create_room_type_valid_image_extension(client, auth, app):
    image_filename = "test123.svg"

    data = {
        "type_name": "Double Room",
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": 2,
        "modified_by_id": 1,
    }
    data["photo"] = (BytesIO(b"abcdef"), image_filename)

    # auth.login()
    assert client.get("api/room-types").status_code == 200
    res = client.post("api/room-types", data=data, content_type="multipart/form-data")
    assert res.status_code == 400
    assert b"Not a valid file extension type: test123.svg" in res.data


def test_update_room_type(client, auth, app):
    image_filename = "test123.jpg"

    data = {
        "type_name": "Single",
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "1",
        "modified_by_id": 1,
    }
    data["photo"] = (BytesIO(b"abcdef"), image_filename)

    # auth.login()
    assert client.get("api/room-types").status_code == 200
    res = client.put("api/room-types/1", data=data, content_type="multipart/form-data")
    assert res.status_code == 204

    file_path = os.path.join(app.static_folder, room_image_location(), image_filename)
    assert os.path.exists(file_path), f"Expected file {file_path} not found"

    # cleanup
    if os.path.exists(file_path):
        os.remove(file_path)


def test_update_room_type_missing_fields(client, auth, app):
    image_filename = "test123.jpg"

    data = {
        # "type_name" missing,
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "1",
        "modified_by_id": 1,
    }
    data["photo"] = (BytesIO(b"abcdef"), image_filename)

    # auth.login()
    assert client.get("api/room-types/1").status_code == 200
    res = client.put("api/room-types/1", data=data, content_type="multipart/form-data")
    assert res.status_code == 400
    assert b"Missing required parameter: type_name" in res.data


def test_update_room_type_valid_fields_type(client, auth, app):
    image_filename = "test123.jpg"

    data = {
        "type_name": "Single",
        "base_price_per_night": "not a number",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "1",
        "modified_by_id": 1,
    }
    data["photo"] = (BytesIO(b"abcdef"), image_filename)

    # auth.login()
    assert client.get("api/room-types/1").status_code == 200
    res = client.put("api/room-types/1", data=data, content_type="multipart/form-data")
    assert res.status_code == 400
    assert b"Invalid value for field: base_price_per_night" in res.data


def test_update_room_type_missing_image(client, auth, app):
    data = {
        "type_name": "Single",
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "1",
        "modified_by_id": 1,
    }
    data["photo"] = None

    # auth.login()
    assert client.get("api/room-types/1").status_code == 200
    res = client.put("api/room-types/1", data=data, content_type="multipart/form-data")
    assert res.status_code == 400
    assert b"Missing required file: photo" in res.data


def test_update_room_type_not_found(client, auth, app):
    image_filename = "test123.jpg"

    data = {
        "type_name": "Single",
        "base_price_per_night": "95",
        "amenities": "Single bed, sea views, shower",
        "max_occupants": "1",
        "modified_by_id": 1,
    }
    data["photo"] = (BytesIO(b"abcdef"), image_filename)

    # auth.login()
    assert client.get("api/room-types").status_code == 200
    res = client.put("api/room-types/3", data=data, content_type="multipart/form-data")
    assert res.status_code == 404


def test_delete_room_type(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/room-types/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(RoomTypes.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_room_type_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/room-types/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(RoomTypes.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2

# @pytest.mark.parametrize(
#     "path",
#     (
#         "/room_types/create",
#         "/room_types/1/update",
#         "/room_types/1/delete",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/room_types/3/update",
#         "/room_types/3/delete",
#     ),
# )
# def test_record_exists(client, auth, path):
#     # test data only has 2 records, expects record 3 not found
#     auth.login()
#     assert client.post(path).status_code == 404


# def test_create(client, auth, app):
#     data = {
#         "type_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     assert client.get("/room_types/create").status_code == 200
#     client.post("/room_types/create", data=data, content_type="multipart/form-data")

#     with app.app_context():
#         db = get_db()
#         count = db.execute("SELECT COUNT(id) FROM room_types").fetchone()[0]
#         assert count == 3


# def test_update(client, auth, app):
#     data = {
#         "type_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     assert client.get("/room_types/1/update").status_code == 200
#     res = client.post(
#         "/room_types/1/update", data=data, content_type="multipart/form-data"
#     )
#     assert res.status_code == 302

#     with app.app_context():
#         db = get_db()
#         res = db.execute("SELECT * FROM room_types WHERE id = 1").fetchone()
#         assert res["type_name"] == "Single"
#         assert res["max_occupants"] == 1


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/room_types/create",
#         "/room_types/1/update",
#     ),
# )
# def test_create_update_validate(client, auth, path):
#     data = {
#         "type_name": "",
#         "base_price_per_night": "",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     response = client.post(path, data=data, content_type="multipart/form-data")
#     assert b"Type Name is required." in response.data
#     assert b"Base Price Per Night is required." in response.data
#     assert b"Max Occupants is required." in response.data


# @pytest.mark.parametrize(
#     "path, extension",
#     [
#         ("/room_types/create", "pdf"),
#         ("/room_types/1/update", "txt"),
#     ],
# )
# def test_create_update_allowed_extensions_validate(client, auth, path, extension):
#     data = {
#         "type_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), f"test.{extension}")

#     auth.login()
#     response = client.post(path, data=data, content_type="multipart/form-data")
#     assert b"Not a valid file type." in response.data


# @pytest.mark.parametrize(
#     "path, key, filename, photo_bytes, expected",
#     [
#         ("/room_types/create", "", "test.jpg", b"abcdef", b"No photo part found"),
#         ("/room_types/create", "photo", "", b"abcdef", b"No selected photo"),
#         ("/room_types/create", "photo", "test.jpg", b"", b"Invalid file"),
#         ("/room_types/1/update", "", "test.jpg", b"abcdef", b"No photo part found"),
#         ("/room_types/1/update", "photo", "", b"abcdef", b"No selected photo"),
#         ("/room_types/1/update", "photo", "test.jpg", b"", b"Invalid file"),
#     ],
# )
# def test_create_update_photo_upload_validate(
#     client, auth, path, key, filename, photo_bytes, expected
# ):
#     data = {
#         "type_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data[key] = (BytesIO(photo_bytes), filename)

#     auth.login()
#     response = client.post(path, data=data, content_type="multipart/form-data")
#     assert expected in response.data


# def test_delete(client, auth, app):
#     auth.login()
#     response = client.post("/room_types/1/delete")
#     assert response.headers["Location"] == "/room_types/"

#     with app.app_context():
#         db = get_db()
#         post = db.execute("SELECT * FROM room_types WHERE id = 1").fetchone()
#         assert post is None
