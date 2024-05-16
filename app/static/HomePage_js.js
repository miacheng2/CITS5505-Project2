import {
  jwtToken,
  userId,
  userName,
  post_array,
  getPost,
  sendReply,
  sendPost,
  searchArticles,
  handleKeyPress,
  deletePost,
} from "../static/js_module.js";

$(document).ready(function () {
  // Asign avatar to each user

  document.getElementById("post_btn").disabled = false;
  document.getElementById("login_warning").style.display = "none";

  const avatars = [
    "/static/pic/HomePage-image/content-avatar1.png",
    "/static/pic/HomePage-image/content-avatar2.png",
    "/static/pic/HomePage-image/content-avatar3.png",
    "/static/pic/HomePage-image/content-avatar4.png",
    "/static/pic/HomePage-image/content-avatar5.png",
    "/static/pic/HomePage-image/content-avatar6.png",
    "/static/pic/HomePage-image/content-avatar7.png",
    "/static/pic/HomePage-image/content-avatar8.png",
    "/static/pic/HomePage-image/content-avatar9.png",
    "/static/pic/HomePage-image/content-avatar10.png",
    "/static/pic/HomePage-image/content-avatardefault.png",
  ];

  const letterToAvatarIndex = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 10,
    K: 1,
    L: 2,
    M: 3,
    N: 4,
    O: 5,
    P: 6,
    Q: 7,
    R: 8,
    S: 9,
    T: 10,
    U: 1,
    V: 2,
    W: 3,
    X: 4,
    Y: 5,
    Z: 6,
  };

  document.addEventListener("DOMContentLoaded", function () {
    // When the textbox is clicked, the reply option is displayed.
    document
      .getElementById("new_post_content")
      .addEventListener("click", function () {
        document.getElementById("replyoption").style.display = "flex";
      });

    document.addEventListener("click", function (event) {
      var replyoption = document.getElementById("replyoption");
      var textbox = document.getElementById("new_post_content");
      if (event.target !== replyoption && event.target !== textbox) {
        replyoption.style.display = "none";
      }
    });

    //   When the page loads, the video plays automatically.
    const videos = document.querySelectorAll(".video");

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7,
    };

    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    videos.forEach((video) => {
      observer.observe(video);
    });
  });

  //When the user loginin his account, assign his avatar
  function getAvatarIndex(userName) {
    var firstLetter = userName.charAt(0).toUpperCase();
    if (letterToAvatarIndex.hasOwnProperty(firstLetter)) {
      return letterToAvatarIndex[firstLetter];
    } else {
      return "default";
    }
  }

  var avatarIndex = getAvatarIndex(userName);

  var imgElements = document.getElementsByClassName("avatarImg");
  for (var i = 0; i < imgElements.length; i++) {
    imgElements[i].src =
      "/static/pic/HomePage-image/content-avatar" + avatarIndex + ".png";
  }

  getPost(jwtToken).then(() => {
    // Count Author Posts
    function countAuthorPosts(posts) {
      const authorPostsCount = {};

      posts.forEach((post) => {
        const authorName = post.authorName;

        if (authorPostsCount.hasOwnProperty(authorName)) {
          authorPostsCount[authorName]++;
        } else {
          authorPostsCount[authorName] = 1;
        }
      });

      return authorPostsCount;
    }

    const authorPostsCount = countAuthorPosts(post_array);
    // console.log(authorPostsCount);

    const authorPostsArray = Object.entries(authorPostsCount);

    authorPostsArray.sort((a, b) => b[1] - a[1]);

    // console.log(authorPostsArray);

    const topAuthors = authorPostsArray.slice(0, 3);

    topAuthors.forEach(([authorName, postCount], index) => {
      const authorDivId = `rank${index + 1}author`;
      const authorDiv = document.getElementById(authorDivId);
      const postDivId = `rank${index + 1}post`;
      const postDiv = document.getElementById(postDivId);
      const avatarDivId = `rank${index + 1}avatar`;
      const avatarDiv = document.getElementById(avatarDivId);

      var avatarIndex = getAvatarIndex(authorName);

      authorDiv.innerHTML = `${authorName}`;
      postDiv.innerHTML = `${postCount} posts`;
      avatarDiv.src = `/static/pic/HomePage-image/content-avatar${avatarIndex}.png`;
    });

    // Asign avatar to each author
    var avatar;
    for (var i = post_array.length - 1; i >= 0; i--) {
      var index = post_array.length - 1 - i;
      var name = post_array[i].authorName;

      if (name.trim() !== "") {
        let initial = name[0].toUpperCase();
        let avatarIndex;

        if (letterToAvatarIndex.hasOwnProperty(initial)) {
          avatarIndex = letterToAvatarIndex[initial];
        } else {
          avatarIndex = avatars.length;
        }
        avatar = avatars[avatarIndex - 1];
      } else {
        console.error("authorName is empty");
      }
      console.log(post_array[i].authorName);
      console.log(userName);
      if (post_array[i].authorName == userName || "admin") {
        var temp_deletePost =
          '<button class="delete-button" onclick="deletePost(' +
          post_array[i].id +
          ')">Delete Post</button>';
      } else {
        var temp_deletePost = "";
      }

      var temp_content = `<article id='article${index}'>
                <div id='content'>
                  <img src='${avatar}' alt='' />
                  <div>
                    <div class='user-name'>
                      ${post_array[i].authorName}
                      <div>
                        <img src='/static/pic/HomePage-image/medal1.png' alt='' />
                      </div>
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
        ' placeholder="Comment Here~" required>';
      var temp_btn =
        '<button type="submit" class="default-button">Reply</button>';
      var temp_replys = "";
      for (var n = 0; n < post_array[i].replyData.length; n++) {
        if (post_array[i].replyData[n].authorName == userName || "admin") {
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
                          <div><img class='reply-avatar' src='${avatar}' alt='' /></div>
                          <div>
                            <div>${post_array[i].replyData[n].authorName} </div>
                            <div class='post-date'>At ${post_array[i].replyData[n].date} </div>
                          </div>
                        </div>
                        <div class='reply'><p class='comment-content'>"${post_array[i].replyData[n].content}" </p></div>
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
        '<div style="display: block">' +
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

  // The following function works for posting the reply.
  window.sendReply = sendReply;

  // The following function works for posting the post.
  window.sendPost = sendPost;

  window.searchArticles = searchArticles;

  window.handleKeyPress = handleKeyPress;

  window.deletePost = deletePost;

  window.deleteReply = deleteReply;

  // Search
  document.addEventListener("DOMContentLoaded", function () {
    document
      .getElementById("closesearchResults")
      .addEventListener("click", function () {
        // document.getElementById("closesearchResults").style.display = "none";
        document.getElementById("searchResults-area").style.display = "none";
        console.log("success!");
      });
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
  document.addEventListener("DOMContentLoaded", function () {
    document
      .getElementById("subscribeForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        var email = document.getElementById("email").value;

        // some functions

        alert("Thank you for subscribing!");
      });
  });
});
