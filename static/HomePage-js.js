// Asign avatar to each user

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

// below is what xiacheng done

// When the page is loaded, do following things
window.onload = function () {
  var jwtToken = localStorage.getItem("token");
  var userId = localStorage.getItem("userId");
  var userName = localStorage.getItem("userName");

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

  if (jwtToken != null || jwtToken != undefined) {
    document.getElementById("post_btn").disabled = false;
    document.getElementById("login_warning").style.display = "none";
    document.getElementById("currentUser").innerHTML = userName;

    var apiAddress = window.location.hostname;
    if (apiAddress == "") {
      apiAddress = "127.0.0.1";
    }
    fetch("http://" + apiAddress + ":5000/getPosts", {
      method: "GET",
      headers: {
        // Pass the local JWT tocken to the backend
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

          const authorPostsCount = countAuthorPosts(result.data.post);
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
          for (var i = result.data.post.length - 1; i >= 0; i--) {
            var index = result.data.post.length - 1 - i;
            var name = result.data.post[i].authorName;

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

            var temp_content = `<article id='article${index}'>
                <div id='content'>
                  <img src='${avatar}' alt='' />
                  <div>
                    <div class='user-name'>
                      ${result.data.post[i].authorName}
                      <div>
                        <img src='/static/pic/HomePage-image/medal1.png' alt='' />
                      </div>
                    </div>
                    <div class='post-date'>
                      ${result.data.post[i].date}
                    </div>
                  </div>
                </div>
                <div class='user-title'>
                  ${result.data.post[i].title}
                </div>
                <div class='user-content'>
                  <p>${result.data.post[i].content}</p>
                </div>
              </article>`;

            var temp_input =
              '<input type="text" class="comment-textbox" id=' +
              result.data.post[i].id +
              ' placeholder="Comment Here~" required/>';
            var temp_btn =
              '<button type="submit" class="default-button">Reply</button>';
            var temp_replys = "";
            for (var n = 0; n < result.data.post[i].replyData.length; n++) {
              temp_replys += `
                <div class='comment-area'>

                        <div class='comment-id-date'>
                          <div><img class='reply-avatar' src='${avatar}' alt='' /></div>
                          <div>
                            <div>${result.data.post[i].replyData[n].authorName} </div>
                            <div class='post-date'>At ${result.data.post[i].replyData[n].date} </div>
                          </div>
                        </div>
                        <div class='reply'><p class='comment-content'>"${result.data.post[i].replyData[n].content}" </p></div>

                </div>`;
            }

            // function for what's happening

            var replyCountDict = {};

            for (var j = 0; j < result.data.post.length; j++) {
              var postTitle = result.data.post[j].title;
              var replyCount = result.data.post[j].replyData.length;
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
              '<div><form onsubmit="sendReply(' +
              result.data.post[i].id +
              '); return false;">' +
              temp_content +
              temp_replys +
              temp_input +
              temp_btn +
              "</form></div>";
          }
        } else {
          console.log("You are not logged in, log in first");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.log("You are not logged in, log in first");
  }
};
// The following function works for posting the reply.
function sendReply(replyToPostId) {
  var jwtToken = localStorage.getItem("token");

  const authorId = localStorage.getItem("userId");
  const content = document.getElementById(replyToPostId).value;

  const data = {
    authorId: authorId,
    replyToPostId: replyToPostId,
    content: content,
  };
  // <!--If your flask server is running on different device, your apiAdress should be the remote server address.Otherwise, it should be the loopback address. -->
  var apiAddress = window.location.hostname;
  if (apiAddress == "") {
    apiAddress = "127.0.0.1";
  }
  fetch("http://" + apiAddress + ":5000/postReply", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json().then((data) => {
        return { status: response.status, data: data };
      });
    })
    .then((result) => {
      if (result.status === 200) {
        console.log("Success:", result.data);
        location.href = "/index";
      } else {
        console.log("Failed:", result.data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Reply Failed");
    });
}
// The following function works for posting the post.
function sendPost() {
  var jwtToken = localStorage.getItem("token");

  const authorId = localStorage.getItem("userId");
  const title = document.getElementById("new_post_title").value;
  const content = document.getElementById("new_post_content").value;

  const data = { authorId: authorId, title: title, content: content };
  var apiAddress = window.location.hostname;
  if (apiAddress == "") {
    apiAddress = "127.0.0.1";
  }

  fetch("http://" + apiAddress + ":5000/postPost", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json().then((data) => {
        return { status: response.status, data: data };
      });
    })
    .then((result) => {
      if (result.status === 200) {
        console.log("Success:", result.data);
      } else {
        console.log("Failed:", result.data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Search

function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchArticles();
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