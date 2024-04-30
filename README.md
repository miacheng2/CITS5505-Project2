# CITS5505-Project2

# This is the group project, 
It is a forum-like website allowing user to register, login, post posts, and post replys to the existing posts. 
This project contains the following folders and files:

-rootDir

|-/deliverables

|--(This is the folder that is the requirement of the submission for tracking the project progress.)

|-/instance

|--(This is the folder contains the database file which stores all posts, replys, and user details)

|--pagedata.db

|-/static

|--(This is the folder for the static medias, js, and css files.)

|--/pic

|-/templates

|--(This folder contains all front-end files, such as index.html, login, and logout pages)

|-- index.html

|-- login.html

|-- logout.html

|-- signup.html

|-- ... Others to be updated

|-.gitignore

|--(This is the file that specify which directories or files to be ignored while pushing the files to Github)

|--(It mainly used for ignoring large envrionment-related packages, which can be installed based on the requirement.txt)

|-app.py

|--(The backend file based on flask, which requires packages from requirement.txt to execute.)

|-README.md

|--(This file, explaing everything of this project)

|-requirement.txt

|--(This file is a record of used packages with their version details. For first-time runners, you have to run "pip install -r requirement.txt" to install these packages for running the backend file.)

## To run this project:
1. Download the whole repo from main branch. Or use clone or pull command if you are authroised.
2. Unzip the downloaded file and navigate to the root dir of the project in CMD (Windows) or terminal (MacOS)
3. If you do not have a virtual environment, you better to create one at this stage, to create:
    "python -m venv venv"
4. Once the virtual environment is created, for Windows users, run: "/venv/Scripts/activate", for MacOS users run "source ./venv/bin/activate"
5. Run flask by using "flask run". Ps, if you wish to test the server on different devices in the same local network, you may run "flask run -host=0.0.0.0". This way, you will be able to access the backend API via "http://<YOUR LAPTOP IP ADDRESS>:5000/<APIs>"

## Flask testing command:
1. init-db
    
-if you with to recreate the database file and add some testing data, you can run "flask init-db" to create the database and some sample posts, replys and 1 admin user with login credential as follows "Username: admin; Password: admin123". 

REMEBER: only run this command if there is no existing pagedata.db in the /instance folder. Otherwise, sample data and user will be added to exisiting db file.

## Add function
1. delete the post by creater
2. delete the reply by replayer
3. addd admin account to delete any post and reply.