(function($) {
    $.fn.numberAnimate = function(setting) {
        var defaults = {
            speed: 1000, 
            num: "", 
            iniAnimate: true, 
            symbol: "", 
            dot: 0, 
            pst: "", 
        };
        var setting = $.extend(defaults, setting);
        if ($(this).length > 1) {
            alert("just only one obj!");
            return;
        }
        if (setting.num == "") {
            alert("must set a num!");
            return;
        }
        var nHtml =
            '<div class="mt-number-animate-dom" data-num="{{num}}">\
              <span class="mt-number-animate-span">0</span>\
              <span class="mt-number-animate-span">1</span>\
              <span class="mt-number-animate-span">2</span>\
              <span class="mt-number-animate-span">3</span>\
              <span class="mt-number-animate-span">4</span>\
              <span class="mt-number-animate-span">5</span>\
              <span class="mt-number-animate-span">6</span>\
              <span class="mt-number-animate-span">7</span>\
              <span class="mt-number-animate-span">8</span>\
              <span class="mt-number-animate-span">9</span>\
              <span class="mt-number-animate-span">0</span>\
              <span class="mt-number-animate-span">.</span>\
            </div>';

        var numToArr = function(num) {
            num = parseFloat(num).toFixed(setting.dot);
            if (typeof num == "number") {
                var arrStr = num.toString().split("");
            } else {
                var arrStr = num.split("");
            }
            //console.log(arrStr);
            return arrStr;
        };

        var setNumDom = function(arrStr) {
            var shtml = '<div class="mt-number-animate">';
            for (var i = 0, len = arrStr.length; i < len; i++) {
                if (
                    i != 0 &&
                    (len - i) % 3 == 0 &&
                    setting.symbol != "" &&
                    arrStr[i] != "."
                ) {
                    shtml +=
                        '<div class="mt-number-animate-dot">' +
                        setting.symbol +
                        "</div>" +
                        nHtml.replace("{{num}}", arrStr[i]);
                } else {
                    shtml += nHtml.replace("{{num}}", arrStr[i]);
                }
            }
            if (setting.pst) {
                shtml += "%</div>";
            } else {
                shtml += "</div>";
            }
            return shtml;
        };

        var runAnimate = function($parent) {
            $parent.find(".mt-number-animate-dom").each(function() {
                var num = $(this).attr("data-num");
                num = num == "." ? 11 : num == 0 ? 10 : num;
                var spanHei = $(this).height() / 12; 
                var thisTop = -num * spanHei + "px";
                if (thisTop != $(this).css("top")) {
                    if (setting.iniAnimate) {
                        if (!window.applicationCache) {
                            $(this).animate(
                                {
                                    top: thisTop,
                                },
                                setting.speed
                            );
                        } else {
                            $(this).css({
                                transform: "translateY(" + thisTop + ")",
                                "-ms-transform": "translateY(" + thisTop + ")",
                                /* IE 9 */
                                "-moz-transform": "translateY(" + thisTop + ")",
                                /* Firefox */
                                "-webkit-transform": "translateY(" + thisTop + ")",
                                /* Safari 和 Chrome */
                                "-o-transform": "translateY(" + thisTop + ")",
                                "-ms-transition": setting.speed / 1000 + "s",
                                "-moz-transition": setting.speed / 1000 + "s",
                                "-webkit-transition": setting.speed / 1000 + "s",
                                "-o-transition": setting.speed / 1000 + "s",
                                transition: setting.speed / 1000 + "s",
                            });
                        }
                    } else {
                        setting.iniAnimate = true;
                        $(this).css({
                            top: thisTop,
                        });
                    }
                }
            });
        };
        var init = function($parent) {
            $parent.html(setNumDom(numToArr(setting.num)));
            runAnimate($parent);
        };
        this.resetData = function(num) {
            var newArr = numToArr(num);
            var $dom = $(this).find(".mt-number-animate-dom");
            if ($dom.length < newArr.length) {
                $(this).html(setNumDom(numToArr(num)));
            } else {
                $dom.each(function(index, el) {
                    $(this).attr("data-num", newArr[index]);
                });
            }
            runAnimate($(this));
        };
        //init
        init($(this));
        return this;
    };
})(jQuery);

window.onload = function() {
    var jwtToken = localStorage.getItem("token");
    var apiAddress = window.location.hostname || "127.0.0.1";

    fetch('http://' + apiAddress + ':5000/getStatistics', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        $('#userPostsAnimate').text(data['user_posts']);
        $('#userCommentsAnimate').text(data['user_comments']);
        $('#totalUsersAnimate').text(data['total_users']);
        $('#totalPostsAnimate').text(data['total_posts']);
        $('#totalCommentsAnimate').text(data['total_comments']);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // 监听 .introduct-item 元素的动画结束事件
    const observeElement = document.querySelector('.introduct-item');
    observeElement.addEventListener('animationend', () => {
        setTimeout(() => {
            const animateElements = observeElement.querySelectorAll('[data-animate="false"]');
            animateElements.forEach(element => {
                $(element).numberAnimate({ num: element.textContent, speed: 1000 });
                element.dataset.animate = 'true';
            });
        }, 500); // 延时 0.5 秒
    });
};