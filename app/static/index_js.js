import {
    jwtToken,
    userId,
    userName,
    post_array,
    getPost,
    sendReply,
    sendPost,
    authorId,
    searchArticles,
    handleKeyPress,
    deletePost,
    deleteReply,
    getAvatarIndex,
    avatars,
    logout
} from "../static/js_module.js";

$(document).ready(function () {

    document.getElementById("post_btn").disabled = false;
    document.getElementById("login_warning").style.display = "none";

    // When the textbox is clicked, the reply option is displayed.
    document
        .getElementById("new_post_title")
        .addEventListener("click", function () {
            document.getElementById("replyoption").style.display = "flex";
        });

    document
        .getElementById("new_post_content")
        .addEventListener("click", function () {
            document.getElementById("replyoption").style.display = "flex";
        });
    
    document.addEventListener("click", function (event) {
        var replyoption = document.getElementById("replyoption");
        var titlebox = document.getElementById("new_post_title");
        var contentbox = document.getElementById("new_post_content");
        if (event.target !== replyoption && event.target !== titlebox && event.target !== contentbox) {
            replyoption.style.display = "none";
        }
    });

    var avatarIndex = getAvatarIndex(userId);
    var imgElements = document.getElementsByClassName("avatarImg");
    for (var i = 0; i < imgElements.length; i++) {
        imgElements[i].src = "../static/pic/HomePage-image/content-avatar" + avatarIndex + ".png";
    }

    getPost(jwtToken).then(() => {
        let pro_name = document.getElementsByClassName("currentUser")

        for (let i = 0; i < pro_name.length; i++) {
            pro_name[i].innerHTML = userName;
        }
        // Count Author Posts
        function countAuthorPosts(posts) {
            const authorPostsCount = {};

            posts.forEach((post) => {
                const authorName = post.authorName;
                const authorId = post.authorId;
                if (authorPostsCount.hasOwnProperty(authorId)) {
                    authorPostsCount[authorId][1]++;
                } else {
                    authorPostsCount[authorId] = [authorName, 1];
                }
            });

            return authorPostsCount;
        }

        const authorPostsCount = countAuthorPosts(post_array);
        // console.log(authorPostsCount);

        const authorPostsArray = Object.entries(authorPostsCount);

       authorPostsArray.sort((a, b) => b[1][1] - a[1][1]);

        // console.log(authorPostsArray);

        const topAuthors = authorPostsArray.slice(0, 3);

        topAuthors.forEach(([authorId, [authorName, postCount]], index) => {
            const authorDivId = `rank${index + 1}author`;
            const authorDiv = document.getElementById(authorDivId);
            const postDivId = `rank${index + 1}post`;
            const postDiv = document.getElementById(postDivId);
            const avatarDivId = `rank${index + 1}avatar`;
            const avatarDiv = document.getElementById(avatarDivId);

            var avatarIndex = getAvatarIndex(authorId);


            authorDiv.innerHTML = `${authorName}`;
            postDiv.innerHTML = `${postCount} posts`;
            avatarDiv.src = `/static/pic/HomePage-image/content-avatar${avatarIndex}.png`;
        });

        // Asign avatar to each author
        var avatar_poster, avatar_replyer;
        for (var i = post_array.length - 1; i >= 0; i--) {
            var index = post_array.length - 1 - i;
            var poster_id = post_array[i].authorId;
            var avatarIndex1 = getAvatarIndex(poster_id);
            avatar_poster = avatars[avatarIndex1];
            
            if (post_array[i].authorName === userName || userName === "admin") {
                var temp_deletePost =
                    '<button class="delete-button" onclick="deletePost(' +
                    post_array[i].id +
                    ')">Delete Post</button>';
            } else {
                var temp_deletePost = "";
                console.log("created")
            }

            var temp_content = `<article id='article${index}'>
                <div id='content'>
                <img src='${avatar_poster}' alt='' />
                <div class='author-text'>
                    <div class='user-name'>
                    ${post_array[i].authorName}
                    </div>
                    <div class='post-date'>
                    ${post_array[i].date}
                    </div>
                </div>
                </div>
                <div class='user-title'>
                ${post_array[i].title}
                </div>
                <div class='user-content'>
                <p>${post_array[i].content}</p>
                </div>
                ${temp_deletePost}
            </article>`;

            var temp_input =
                '<input type="text" class="comment-textbox" id=' +
                post_array[i].id +
                ' placeholder="Comment Here" required>';
            var temp_btn =
                '<button type="submit" class="button-middle">Reply</button>';
            var temp_replys = "";

            for (var n = 0; n < post_array[i].replyData.length; n++) {
                var replyer_id = post_array[i].replyData[n].authorId;
                var avatarIndex2 = getAvatarIndex(replyer_id);
                avatar_replyer = avatars[avatarIndex2];
                console.log()
                if (post_array[i].authorName === userName || userName === "admin") {
                    var deleteReply_btn =
                        '<button class="delete-button" onclick="deleteReply(' +
                        post_array[i].replyData[n].id +
                        ')">Delete Reply</button>';
                } else {
                    var deleteReply_btn = "";
                }
                
                temp_replys += `

                <div class='comment-area' style='display: block'>

                        <div class='comment-id-date'>
                        <div><img class='reply-avatar' src='${avatar_replyer}' alt='' /></div>
                        <div class='author-text'>
                            <div>${post_array[i].replyData[n].authorName} </div>
                            <div class='post-date'>At ${post_array[i].replyData[n].date} </div>
                        </div>
                        </div>
                        <div class='reply'><p class='comment-content'>${post_array[i].replyData[n].content} </p></div>
                        ${deleteReply_btn}
                </div>`;
            }

            // function for what's happening

            var replyCountDict = {};

            for (var j = 0; j < post_array.length; j++) {
                var postTitle = post_array[j].title;
                var replyCount = post_array[j].replyData.length;
                replyCountDict[postTitle] = replyCount;
            }

            var replyCountArray = [];
            for (var title in replyCountDict) {
                replyCountArray.push({
                    title: title,
                    replyCount: replyCountDict[title],
                });
            }

            replyCountArray.sort(function (a, b) {
                return b.replyCount - a.replyCount;
            });

            const topTopics = replyCountArray.slice(0, 6);

            topTopics.forEach((topicObj, index) => {
                const topTopicDivId = `topic${index + 1}`;
                const topTopicDiv = document.getElementById(topTopicDivId);
                const topicPostDivId = `topicPost${index + 1}`;
                const topicPostDiv = document.getElementById(topicPostDivId);

                topTopicDiv.innerHTML = `"${topicObj.title}"`;
                topicPostDiv.innerHTML = `${topicObj.replyCount} replys`;
            });

            document.getElementById("postsBox").innerHTML +=
                '<div class="eachPost" style="display: block">' +
                temp_content +
                '<form onsubmit="sendReply(' +
                post_array[i].id +
                '); return false;">' +
                temp_replys +
                temp_input +
                temp_btn +
                "</form></div>";        
        }
    });

    window.sendReply = sendReply;

    window.sendPost = sendPost;

    window.searchArticles = searchArticles;

    window.handleKeyPress = handleKeyPress;

    window.deletePost = deletePost;

    window.deleteReply = deleteReply;

    window.logout = logout;

    document
        .getElementById("closesearchResults")
        .addEventListener("click", function () {
            document.getElementById("searchResults-area").style.display = "none";
            console.log("success!");
        });

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            searchArticles();
            document.getElementById("closesearchResults").style.display = "flex";
            document.getElementById("searchResults-area").style.display = "block";
        }
    }

    function searchArticles() {
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

    // subscribe function
    document
        .getElementById("subscribeForm")
        .addEventListener("submit", function (event) {
            event.preventDefault();

            var email = document.getElementById("email").value;

            alert("Thank you for subscribing!");
        });
});