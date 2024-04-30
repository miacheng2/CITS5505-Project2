document.addEventListener("DOMContentLoaded", function () {
  // When the textbox is clicked, the reply option is displayed.
  document.getElementById("textbox").addEventListener("click", function () {
    document.getElementById("replyoption").style.display = "flex";
  });

  document.addEventListener("click", function (event) {
    var replyoption = document.getElementById("replyoption");
    var textbox = document.getElementById("textbox");
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
