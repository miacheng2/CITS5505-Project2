export let jwtToken = localStorage.getItem("token");
export let userId = localStorage.getItem("userId");
export let userName = localStorage.getItem("userName");
export let apiAddress = window.location.hostname
export let post_array = []

export function getPost(jwtToken) {
    return new Promise((resolve, reject) => {
        if (jwtToken != null || jwtToken != undefined) {


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

export function searchArticles() {
    const searchInput = document
        .getElementById("searchInput")
        .value.toLowerCase();
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    const articles = document.querySelectorAll("article");

    articles.forEach((article, index) => {
        const title = article.querySelector(".user-title").textContent.trim();
        const content = article.querySelector("p").textContent.trim();

        if (
            title.toLowerCase().includes(searchInput) ||
            content.toLowerCase().includes(searchInput)
        ) {
            const articleElement = document.createElement("div");
            articleElement.innerHTML = `<h3><a href="#article${index}">${title}</a></h3><p>${content}</p>`;
            searchResults.appendChild(articleElement);
        }
    });
}

export function handleKeyPress(event) {
    if (event.key === "Enter") {
        searchArticles();
    }
}

