import { jwtToken, userId, userName, post_array, getPost } from '../static/js_module.js';
$(document).ready(function () {

    let post_num = 0

    getPost(jwtToken).then(() => {
        let pro_name = document.getElementsByClassName("currentUser")

        for (let i = 0; i < pro_name.length; i++) {
            pro_name[i].innerHTML = userName;
        }

        for (let i = 0; i < post_array.length; i++) {
            let temp_content = '<h3> Title: ' + post_array[i].title + '</h3>'
            let temp_replys = ''
            let reply_replys = ''
            let reply_titles = ''
            if (post_array[i].authorName === userName) {
                for (let n = 0; n < post_array[i].replyData.length; n++) {
                    temp_replys += '<p>' + post_array[i].replyData[n].authorName + ' commented:<span class = "pro_date"> (' + post_array[i].replyData[n].date + ')' + '</span></p> <p>' + post_array[i].replyData[n].content + '</p>'
                }
                document.getElementById("pro_postsBox").innerHTML += '<div class = "pro_post">' + temp_content + temp_replys + '</div>'
                post_num++
            }
            for (let n = 0; n < post_array[i].replyData.length; n++) {
                if (userName === post_array[i].replyData[n].authorName) {
                    reply_replys += '<p>' + post_array[i].replyData[n].authorName + ' commented:<span class = "pro_date"> (' + post_array[i].replyData[n].date + ')' + '</span></p> <p>' + post_array[i].replyData[n].content + '</p>'
                    reply_titles = temp_content
                    document.getElementById("pro_replybox").innerHTML += '<div class = "pro_post">' + reply_titles + reply_replys + '</div>'
                    console.log(reply_titles)
                }
            }
        }
        document.getElementById("pro_postNum").innerHTML += post_num + " posts"
    }).catch(error => {
        console.error("An error occurred:", error);
    });


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
