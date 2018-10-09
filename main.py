from datetime import datetime, timedelta
from asana import Client

from flask import Flask, jsonify, request
from flask_jwt_simple import (
    JWTManager, jwt_required, create_jwt
)

import requests_toolbelt.adapters.appengine

# Use the App Engine Requests adapter. This makes sure that Requests uses
# URLFetch.
requests_toolbelt.adapters.appengine.monkeypatch()

# General Settings
ASANA_API_KEY = '<FILL ME IN>'
USERNAME = '<FILL_ME_IN>'
PASSWORD = '<FILL_ME_IN>'
JWT_SECRET_KEY = '<FILL_ME_IN>'

# Workflow settings
BACKLOG_TAG_ID = <FILL ME IN>
BAG_OF_TASKS_TAG_ID = <FILL ME IN>
MAIN_PRJ_ID = <FILL ME IN>
MAIN_PRJ = {'id': MAIN_PRJ_ID, 'name': 'Main'}

ASANA_TIMEOUT = 60

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
jwt = JWTManager(app)

asana_client = Client.access_token(ASANA_API_KEY)


@app.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    params = request.get_json()
    username = params.get('username', None)
    password = params.get('password', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    if username != USERNAME or password != PASSWORD:
        return jsonify({"msg": "Bad username or password"}), 401

    # Identity can be any data that is json serializable
    ret = {'jwt': create_jwt(identity=username)}
    return jsonify(ret), 200


def get_tomorrow():
    tomorrow = datetime.now() + timedelta(days=1)
    return tomorrow.strftime('%Y-%m-%d')


def get_tasks_with_tag(tag_id):
    tomorrow = get_tomorrow()
    tasks = asana_client.tasks.find_all({
        'tag': tag_id,
        'completed_since': tomorrow
    }, timeout=ASANA_TIMEOUT)

    result = []
    for task in tasks:
        result.append(task)

    return result


@app.route('/api/updatetask', methods=['POST'])
@jwt_required
def update_task():
    task_to_update = request.json
    task_id = int(task_to_update['id'])
    project_to_add_id = int(task_to_update['project'])

    tags_info = task_to_update['tags']
    tags_to_add = tags_info['add']
    tags_to_remove = tags_info['remove']

    # tags
    for to_remove in tags_to_remove:
        asana_client.tasks.remove_tag(
            task=task_id,
            tag=int(to_remove),
            timeout=ASANA_TIMEOUT
        )

    for to_add in tags_to_add:
        asana_client.tasks.add_tag(
            task=task_id,
            tag=int(to_add),
            timeout=ASANA_TIMEOUT
        )

    # projects
    asana_client.tasks.remove_project(
        task=task_id,
        project=int(MAIN_PRJ['id']),
        timeout=ASANA_TIMEOUT
    )
    asana_client.tasks.add_project(
        task=task_id,
        project=project_to_add_id,
        timeout=ASANA_TIMEOUT
    )

    return "ok"


@app.route('/api/triage', methods=['GET'])
@jwt_required
def triage_tasks():
    tasks = get_tasks_with_tag(BAG_OF_TASKS_TAG_ID)
    return jsonify(tasks)


@app.route('/api/backlog', methods=['GET'])
@jwt_required
def backlog_tasks():
    tasks = get_tasks_with_tag(BACKLOG_TAG_ID)
    return jsonify(tasks)


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
