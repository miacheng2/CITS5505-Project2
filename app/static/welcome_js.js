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

    const observeElement = document.querySelector('.introduct-item');
    observeElement.addEventListener('animationend', () => {
        setTimeout(() => {
            const animateElements = observeElement.querySelectorAll('[data-animate="false"]');
            animateElements.forEach(element => {
                $(element).numberAnimate({ num: element.textContent, speed: 1000 });
                element.dataset.animate = 'true';
            });
        }, 500); 
    });
};
