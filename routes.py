from app import flaskApp
from flask import render_template
@flaskApp.route("/")
def groups():
    return render_template('createGroup.html')
