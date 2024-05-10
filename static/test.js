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
          for (var i = 0; i < result.data.post.length; i++) {
            var temp_content =
              "<div>" +
              "<img src='/static/pic/HomePage-image/content-avatar1.png' alt='' />" +
              "<div>" +
              "<div class='user-name'>" +
              result.data.post[i].authorName +
              "<div>" +
              "<img src='/static/pic/HomePage-image/medal1.png' alt='' />" +
              "</div>" +
              "</div>" +
              "<div class='post-date'>" +
              result.data.post[i].date +
              "</div>" +
              "</div>" +
              "</div>" +
              "<div class='user-title'>" +
              result.data.post[i].title +
              "</div>" +
              "<div class='user-content'>" +
              "<p>" +
              result.data.post[i].content +
              "</p>" +
              "</div>";
            var temp_input =
              '<input type="text" class="comment-textbox" id=' +
              result.data.post[i].id +
              ' placeholder="Comment Here~" required/>';
            var temp_btn =
              '<button type="submit" class="default-button">Post Comment</button>';
            var temp_replys = "";
            for (var n = 0; n < result.data.post[i].replyData.length; n++) {
              temp_replys +=
                "<div class='comment-area'>" +
                "<p>At " +
                result.data.post[i].replyData[n].date +
                " " +
                result.data.post[i].replyData[n].authorName +
                " commented:</p> <p class='comment-content'> " +
                result.data.post[i].replyData[n].content +
                " </p>" +
                "</div>";
            }
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
        location.href = "./index.html";
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
