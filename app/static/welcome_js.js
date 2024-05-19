window.onload = function() {
    var apiAddress = window.location.hostname || "127.0.0.1";

    fetch('http://' + apiAddress + ':5000/getStatistics', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        $('#totalUser').text(data['totalUser']);
        $('#totalPost').text(data['totalPost']);
        $('#totalReply').text(data['totalReply']);
    })
    .catch(error => {
        console.error('Error:', error);
    })}