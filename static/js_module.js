export let jwtToken = localStorage.getItem("token");
export let userId = localStorage.getItem("userId");
export let userName = localStorage.getItem("userName");
export let apiAddress = window.location.hostname
export let post_array = []

export function getPost(jwtToken) {
    return new Promise((resolve, reject) => {
        if (jwtToken != null || jwtToken != undefined) {
            // document.getElementById("post_btn").disabled = false;
            // document.getElementById("login_warning").style.display = "none";
            // document.getElementById("currentUser").innerHTML = "Hi," + userName

            let apiAddress = window.location.hostname
            if (apiAddress == "") {
                apiAddress = "127.0.0.1"
            }
            fetch('http://' + apiAddress + ':5000/getPosts', {
                method: 'GET',
                headers: {
                    // Pass the local JWT tocken to the backend
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {
                    return response.json().then(data => {
                        return { status: response.status, data: data };
                    });
                })
                .then(result => {
                    if (result.status === 200) {
                        console.log('Success:', result.data);
                        post_array = result.data.post;
                        resolve(post_array);

                    } else {
                        console.log("You are not logged in, log in first");
                        reject(new Error("Not logged in"));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    reject(error);
                });
        } else {
            console.log("You are not logged in, log in first");
            reject(new Error("JWT token is missing"));
        }
    });
}

export function sendReply(replyToPostId) {
    var jwtToken = localStorage.getItem("token")

    const authorId = localStorage.getItem("userId");
    const content = document.getElementById(replyToPostId).value;

    const data = { authorId: authorId, replyToPostId: replyToPostId, content: content };
    // <!--If your flask server is running on different device, your apiAdress should be the remote server address.Otherwise, it should be the loopback address. -->
    var apiAddress = window.location.hostname
    if (apiAddress == "") {
        apiAddress = "127.0.0.1"
    }
    fetch('http://' + apiAddress + ':5000/postReply', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json().then(data => {
                return { status: response.status, data: data };
            });
        })
        .then(result => {
            if (result.status === 200) {
                console.log('Success:', result.data);
                location.href = "/index";
            } else {
                console.log('Failed:', result.data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Reply Failed');
        });
}

export function sendPost() {
    var jwtToken = localStorage.getItem("token")

    const authorId = localStorage.getItem("userId");
    const title = document.getElementById("new_post_title").value;
    const content = document.getElementById("new_post_content").value;

    const data = { authorId: authorId, title: title, content: content };
    var apiAddress = window.location.hostname
    if (apiAddress == "") {
        apiAddress = "127.0.0.1"
    }

    fetch('http://' + apiAddress + ':5000/postPost', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json().then(data => {
                return { status: response.status, data: data };
            });
        })
        .then(result => {
            if (result.status === 200) {
                console.log('Success:', result.data);
            } else {
                console.log('Failed:', result.data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



