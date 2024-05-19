export let jwtToken = localStorage.getItem("token");
export let userId = localStorage.getItem("userId");
export let authorId = localStorage.getItem("authorId");
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
                        console.log("This data:")
                        console.log(post_array)
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
    var jwtToken = localStorage.getItem("token");

    const authorId = localStorage.getItem("userId");
    const content = document.getElementById(replyToPostId).value;

    const data = { authorId: authorId, replyToPostId: replyToPostId, content: content };
    var apiAddress = window.location.hostname;
    if (apiAddress == "") {
        apiAddress = "127.0.0.1";
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
    var jwtToken = localStorage.getItem("token");

    const authorId = localStorage.getItem("userId");
    const title = document.getElementById("new_post_title").value;
    const content = document.getElementById("new_post_content").value;

    const data = { authorId: authorId, title: title, content: content };
    var apiAddress = window.location.hostname;
    if (apiAddress == "") {
        apiAddress = "127.0.0.1";
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

export function deletePost(postId) {
    var jwtToken = localStorage.getItem("token");
    fetch(`/posts/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                console.log("Post deleted successfully");
                window.location.reload();
            } else {
                console.error("Failed to delete post");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

export function deleteReply(replyId) {
    var jwtToken = localStorage.getItem("token");

    fetch(`/replies/${replyId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                console.log("Reply deleted successfully");
                window.location.reload();
            } else {
                console.error("Failed to delete reply");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

export function logout() {
    var jwtToken = localStorage.getItem("token");
    var apiAddress = window.location.hostname;
    let userName = localStorage.getItem("userName");

    console.log(jwtToken);

    if (apiAddress == "") {
        apiAddress = "127.0.0.1";
    }

    fetch("/logout", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            return response.json().then((data) => {
                return { status: response.status, data: data };
            });
        })
        .then((result) => {
            if (result.status === 200) {
                console.log("Success:", result.data);
                localStorage.removeItem("token");
                localStorage.removeItem("userName");
                localStorage.removeItem("userId");
                location.href = "./index.html";
            } else {
                console.log("Failed:", result.data);
                localStorage.removeItem("token");
                localStorage.removeItem("userName");
                localStorage.removeItem("userId");
                location.href = "/index";
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");
            location.href = "/index";
        });
}

export function getAvatarIndex(Id) {
    return parseInt(Id) % 10; 
}



export const avatars = [
    "/static/pic/HomePage-image/content-avatar0.png",
    "/static/pic/HomePage-image/content-avatar1.png",
    "/static/pic/HomePage-image/content-avatar2.png",
    "/static/pic/HomePage-image/content-avatar3.png",
    "/static/pic/HomePage-image/content-avatar4.png",
    "/static/pic/HomePage-image/content-avatar5.png",
    "/static/pic/HomePage-image/content-avatar6.png",
    "/static/pic/HomePage-image/content-avatar7.png",
    "/static/pic/HomePage-image/content-avatar8.png",
    "/static/pic/HomePage-image/content-avatar9.png",
];

