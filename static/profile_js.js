$(document).ready(function () {

    let jwtToken = localStorage.getItem("token")
    let userId = localStorage.getItem("userId")
    let userName = localStorage.getItem("userName")
    let post_num = 0


    if (jwtToken != null || jwtToken != undefined) {
        let pro_name = document.getElementsByClassName("currentUser")

        for (let i = 0; i < pro_name.length; i++) {
            pro_name[i].innerHTML = userName;
        }

        var apiAddress = window.location.hostname
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
                    for (var i = 0; i < result.data.post.length; i++) {
                        var temp_content = '<h3> Title: ' + result.data.post[i].title + '</h3>'
                        var temp_replys = ''
                        var reply_replys = ''
                        var reply_titles = ''
                        if (result.data.post[i].authorName === userName) {
                            for (var n = 0; n < result.data.post[i].replyData.length; n++) {
                                temp_replys += '<p>' + result.data.post[i].replyData[n].authorName + ' commented:<span class = "pro_date"> (' + result.data.post[i].replyData[n].date + ')' + '</span></p> <p>' + result.data.post[i].replyData[n].content + '</p>'
                            }
                            document.getElementById("pro_postsBox").innerHTML += '<div class = "pro_post">' + temp_content + temp_replys + '</div>'
                            post_num++
                        }
                        for (var n = 0; n < result.data.post[i].replyData.length; n++) {
                            if (userName === result.data.post[i].replyData[n].authorName) {
                                reply_replys += '<p>' + result.data.post[i].replyData[n].authorName + ' commented:<span class = "pro_date"> (' + result.data.post[i].replyData[n].date + ')' + '</span></p> <p>' + result.data.post[i].replyData[n].content + '</p>'
                                reply_titles = temp_content
                                document.getElementById("pro_replybox").innerHTML += '<div class = "pro_post">' + reply_titles + reply_replys + '</div>'
                                console.log(reply_titles)
                            }
                        }
                    }

                    document.getElementById("pro_postNum").innerHTML += post_num + " posts"
                } else {
                    console.log("You are not logged in, log in first")
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }
    else {
        console.log("You are not logged in, log in first")
    };


    $(".edit_button").click(function () {
        $(".pro_edit").fadeIn();
    });


    $(".close_button").click(function () {
        $(".pro_edit").fadeOut();
    });

    $("#pro_posts").click(function () {
        let pro_post_content = $("#pro_postsBox")
        let pro_reply_content = $("#pro_replybox")
        if (pro_post_content.css('visibility') === 'hidden') {
            pro_post_content.css({
                'visibility': 'visible',
                'z-index': 1
            });
            pro_reply_content.css({
                'visibility': 'hidden',
                'z-index': -1
            })
        }
    })

    $("#pro_replies").click(function () {
        let pro_post_content = $("#pro_postsBox")
        let pro_reply_content = $("#pro_replybox")
        if (pro_reply_content.css('z-index') === "-1") {
            pro_reply_content.css({
                'visibility': 'visible',
                'z-index': 1
            });
            pro_post_content.css({
                'visibility': 'hidden',
                'z-index': -1
            })
        }
        console.log("What")

    })
})
