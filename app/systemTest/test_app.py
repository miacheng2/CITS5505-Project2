import pytest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import subprocess
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os




@pytest.fixture(scope="session", autouse=True)
def flask_app():
    os.environ['FLASK_TEST_CONFIG'] = 'True'

    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'instance', 'test.db')

    if os.path.exists(db_path):
        os.remove(db_path)

    subprocess.run(["flask", "init_db"])
    process = subprocess.Popen(["flask", "run", "--port=5000"]) 
    time.sleep(1)
    yield
    process.kill() 
    os.environ['FLASK_TEST_CONFIG'] = 'False'
    max_retries = 3
    retry_delay = 1
    for i in range(max_retries):
        try:
            if os.path.exists(db_path):
                os.remove(db_path)
            break
        except PermissionError:
            if i == max_retries - 1:
                raise
            time.sleep(retry_delay)
    
    process.wait()

@pytest.fixture
def driver():
    option = webdriver.ChromeOptions()
    option.add_argument("start-maximized")
    _driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=option)
    yield _driver
    os.environ['FLASK_TEST_CONFIG'] = 'False'
    _driver.quit()

def test_access_index(driver):
    driver.get("http://127.0.0.1:5000/") 
    assert "" in driver.title

def test_valid_signup(driver):
    driver.get("http://127.0.0.1:5000/signup")  
    
    username_input = driver.find_element(By.ID, "username")
    password_input = driver.find_element(By.ID, "password")
    usernameConfirm_input = driver.find_element(By.ID, "usernameConfirm")
    password_Confirm_input = driver.find_element(By.ID, "passwordConfirm")
    
    username_input.send_keys("n5b7")
    password_input.send_keys("Po$SWor6")
    usernameConfirm_input.send_keys("n5b7")
    password_Confirm_input.send_keys("Po$SWor6")
    
    
    sign_button = driver.find_element(By.ID, "signupBTN")
    sign_button.click()
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "login_form"))
    )
    assert "login" in driver.current_url
    
def test_valid_login(driver):
    driver.get("http://127.0.0.1:5000/login")  
    
    username_input = driver.find_element(By.NAME, "username")
    password_input = driver.find_element(By.NAME, "password")
    
    username_input.send_keys("admin")
    password_input.send_keys("admin123")
    
    login_button = driver.find_element(By.XPATH, "//button[text()='Login']")
    login_button.click()
    time.sleep(5)
    posts_box = driver.find_element(By.ID, "postsBox")
    inner_html = posts_box.get_attribute('innerHTML')

    assert inner_html.strip() != ""
    

def test_send_post(driver):
    driver.get("http://127.0.0.1:5000/login")  
    
    username_input = driver.find_element(By.NAME, "username")
    password_input = driver.find_element(By.NAME, "password")
    
    username_input.send_keys("admin")
    password_input.send_keys("admin123")
    
    login_button = driver.find_element(By.XPATH, "//button[text()='Login']")
    login_button.click()
    
    driver.get("http://127.0.0.1:5000/index") 
    post_title = driver.find_element(By.ID, "new_post_title")
    post_content = driver.find_element(By.ID, "new_post_content")

    title_text = "This is a testing post title by selenium kits"
    content_text = "This is a testing post content by selenium kits"

    post_title.send_keys(title_text)
    post_content.send_keys(content_text)

    post_btn = driver.find_element(By.ID, "post_btn")
    post_btn.click()

    time.sleep(5)

    posts_box = driver.find_element(By.ID, "postsBox")
    inner_html = posts_box.get_attribute('innerHTML')

    assert title_text in inner_html, "The post title is not in the posts box."



