# CITS5505 Group Project

## Purpose of the application

The application is a study help forum, which named "Help5505", is designed to be a platform that associate CITS5505's teachers and students with teaching management, study assistance, technical exchange and sharing.

### Home Page

The home page serves as an introductory interface, featuring the site’s name “HELP5505” and the slogan on the left. A login button is located on the right side. Scrolling down reveals two content blocks: the left block provides a brief introduction to the app with a registration link, while the right block displays real-time backend data to convey a thriving community feel.

### User Registration and Login

Registered users can click the login button to navigate to the login page. Incorrect username or password entries trigger corresponding prompts. Successful login redirects to the index page, opening the forum. Clicking the registration link leads to the registration page, where users can sign up by entering their username and password twice. Errors or already used usernames prompt alerts. Upon successful registration, user data is added to the backend database, and the user is redirected to the index page.

### Index Page

The index page is the main interface of the forum, where users can post, browse, or comment on others’ posts. Clicking the input box at the top displays a prompt, guiding users to click the tips in the left navbar for detailed guidance. Create a new post updates the information stream below. Users can delete the posts which is created by them, along with its replies. An admin account is built into the backend with permissions to delete any posts and replies.

### Search and Discover

Users can search for posts containing specific keywords using the search box in the upper right corner and close the search results by clicking the eye icon. The discover section on the right highlights current trends, such as recent posts with the most comments or users with the highest number of posts.

### Navigation

Clicking the navbar on the left allows for navigation. The Home button navigates back to the index page, Profile navigates to the user’s profile page, and Tips triggers a guidance popup. Clicking the post button enters input mode at the top post block. Clicking the large button at the bottom navigates to the profile page.

### Profile Page

The profile page is the user’s personal information interface. Users can click on the ‘POSTS’ and ‘REPLIES’ tabs in the middle of the page to view their previously published posts and replies.

### Logout and Login

Users can log out by clicking logout at the bottom of the left navbar or re-login by clicking login.

## Group Member Information Table

| UWA ID   | Student name    | Github user name |
|----------|-----------------|------------------|
| 23891727 | Tang Fung Leung | morepresent      |
| 24155751 | Haozhi Lian     | haozhil          |
| 24061397 | Xia Cheng       | miacheng2        |
| 24041794 | Qianping Wang   | whatthehiao      |

## Architecture of the application

CITS5505-Project2-main

│ .DS_Store

│ .gitignore

│ README.md

│ requirement.txt

│ run.py

│

├─app ---------------------------- // Flask application components

│ │ config.py

│ │ models.py

│ │ routes.p

│ │ \_*init*\_.py

│ │

│ ├─static ---------------------- // Static files like media, JavaScript, and CSS

│ │ │ animated.css

│ │ │ animation.js

│ │ │ base.css

│ │ │ bootstrap.bundle.min.js

│ │ │ bootstrap.bundle.min.js.map

│ │ │ bootstrap.min.css

│ │ │ bootstrap.min.css.map

│ │ │ Dosis-Bold.ttf

│ │ │ index_css.css

│ │ │ index_js.js

│ │ │ js_module.js

│ │ │ profile_js.js

│ │ │ profile_styles.css

│ │ │ welcome_css.css

│ │ │ welcome_js.js

│ │ │

│ │ └─pic --------------------- // Pictures used in the application

│ │ │ chevron.gif

│ │ │ intro-back.png

│ │ │ intro-gallery.png

│ │ │ signPic.png

│ │ │

│ │ └─HomePage-image

│ │ close.png

│ │ clothes.png

│ │ communities.png

│ │ content-avatar0.png

│ │ content-avatar1.png

│ │ content-avatar2.png

│ │ content-avatar3.png

│ │ content-avatar4.png

│ │ content-avatar5.png

│ │ content-avatar6.png

│ │ content-avatar7.png

│ │ content-avatar8.png

│ │ content-avatar9.png

│ │ dotdotdot.png

│ │ explore.png

│ │ home.png

│ │ hot.png

│ │ js-meme.png

│ │ logo.png

│ │ magnifying-glass-white.png

│ │ magnifying-glass.png

│ │ medal1.png

│ │ message.png

│ │ more.png

│ │ notification.png

│ │ post-emoji.png

│ │ post-picture.png

│ │ post-schedule.png

│ │ post-world.png

│ │ profile.png

│ │

│ ├─systemTest -------------- // Pytest system test files

│ │ test_app.py

│ │ \_*init*\_.py

│ │

│ ├─templates ---------------- // HTML templates for the application

│ │ base.html

│ │ index.html

│ │ login.html

│ │ logout.html

│ │ profile.html

│ │ search.html

│ │ signup.html

│ │ welcome.html

│ │

│ └─unitTest ------------------ // Pytest unit test files

│ test_app.py

│ \_*init*\_.py

│

├─deliverables ----------------- // Media files for tracking project progress

│ testResult.png...

│

└─instance ---------------------- // Database with posts, replies, and user details

pagedata.db

## Launch the application

### Step 1

For first-time users, execute `pip install -r requirements.txt` to install all the necessary dependency packages for running the backend file.

### Step 2

Download the entire repository from the main branch. Alternatively, use the `git clone` or `git pull` command if you have the necessary permissions.

### Step 3

Unzip the downloaded file and navigate to the root directory of the project in CMD (Windows) or Terminal (macOS).

### Step 4

If you do not have a virtual environment, it is advisable to create one at this stage. To do so, run `python -m venv venv.`

### Step 5

After creation, activate the virtual environment. For Windows users, run `.\venv\Scripts\activate`. For macOS users, run `source /venv/bin/activate`.

### Step 6

Launch Flask with the command `flask run`. If you wish to test the server on different devices within the same local network, execute `flask run --host=0.0.0.0`. This will allow the backend API access via `http://<your-local-ip>:5000/`.

## Run the tests for the application

### unit test

A suite of 20 unit tests is available. To initiate the unit tests, run `pytest app/unitTest`.

### system test

A suite of 4 system tests is available. To initiate the system tests, run `pytest app/systemTest`.
