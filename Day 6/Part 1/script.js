'use strict';

let btnLogin = document.getElementById('btnLogin');
btnLogin.addEventListener('click', login, false);

function login() {
// create a client here: https://developer.whereismytransport.com/clients
    let clientID = document.getElementById('clientID');
    let clientSecret = document.getElementById('clientSecret');

    var CLIENT_ID = clientID.value;
    var CLIENT_SECRET = clientSecret.value;
    var payload = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'transportapi:all'
    };
    var request = new XMLHttpRequest();
    request.open('POST', 'https://identity.whereismytransport.com/connect/token', true);
    request.addEventListener('load', function () {
        var response = JSON.parse(this.responseText);
        var token = response.access_token;
        window.token = token;
    });
    request.setRequestHeader('Accept', 'application/json');
    var formData = new FormData();

    for (var key in payload) {
        formData.append(key, payload[key]);
    }

    request.send(formData);
}

let token = window.token;

