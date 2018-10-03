window.onload = function() {
    hideAll();

    if(hasToken()) {
        try {
            // get agencies
            getAgencies(getToken());
            showForm('agencies-form');
        } catch(error) {
            console.log("unable to get token. There was an error" + error.message);
        }
    } else {
        showForm('login-form')
    }

    var submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', loginHandler, false);

    var submitAgency = document.getElementById('submit-agency');
    submitAgency.addEventListener('click',agencyHandler, false);

    var submitLine = document.getElementById('submit-lines');
    submitLine.addEventListener('click', lineHandler, false);

    var logOutButton = document.getElementById('submit-logout');
    logOutButton.addEventListener('click', logout, false);

};

function hasToken() {
    //CHECK if token exists in local storage

    var token = localStorage.getItem('token');
    var storageDate = localStorage.getItem('storageDate');
    var date = new Date(storageDate.replace(/,/gi,''));
    var dateNow = Date.now();

    if(token && (date+3600 < dateNow)) {
        // loginForm.classList.add('is-invisible')
        hideForm('login-form');

        //show the logout form
        showForm('logout-form');

        return true
    }
    else {
        logout();

        return false
    }
}

function getToken(){
    var token = this.localStorage.getItem('token');

    if(token === null || token === undefined || token === 'undefined'){
        throw new Error("Invalid token");
    } else {
        return token;
    }

}

function getClientId() {
    var clientId = document.getElementById('client-id')
    return clientId.value
}

function getClientSecret() {
    var clientSecret = document.getElementById('client-secret')
    return clientSecret.value
}

function loginHandler(event){
    event.preventDefault();

    var clientId = getClientId();
    var clientSecret = getClientSecret();

    login(clientId, clientSecret)
}

function login(clientId, clientSecret) {
    //From whereismytransport developer page
    var CLIENT_ID = clientId;
    var CLIENT_SECRET = clientSecret;
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

        if(this.status === 200){
            localStorage.setItem('token', token)
            localStorage.setItem('storageDate', Date.now().toLocaleString())

            getAgencies(getToken());

            hideForm('login-form');
            showForm('agencies-form');
        } else {
            console.log("failed to get token, invalid client details");
        }
    });
    request.setRequestHeader('Accept', 'application/json');
    var formData = new FormData();

    for (var key in payload) {
        formData.append(key, payload[key]);
    }

    request.send(formData);
}

function getAgencies(token) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function () {
        var response = JSON.parse(this.responseText);
        // var agenciesList = document.getElementById('agencies-list')
        // agenciesList.textContent = this.responseText

        addAgenciesToDropDown(response)
    });
    request.open('GET', 'https://platform.whereismytransport.com/api/agencies', true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send();
}

function addAgenciesToDropDown(agenciesList) {
    var agenciesSelect = document.getElementById('agencies-select');
    agenciesSelect.options.length = 0;
    agenciesSelect.options.add(new Option("Select an option", null, true, true));
    agenciesList.forEach(function(agency) {
        agenciesSelect.options.add(new Option(agency.name, agency.id, false, false));
    });
}

function agencyHandler(event){
    event.preventDefault();

    try {
      var agencies = document.getElementById('agencies-select');
      var selectedAgency = agencies.options[agencies.selectedIndex].value;

        getLines(getToken(), selectedAgency);

        hideForm('agencies-form');
        showForm('lines-form');
    } catch(error){
        console.log("unable to get token. There was an error" + error.message);
    }
}

function getLines(token, agency){
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(){
       var response = JSON.parse(this.responseText);

       addLinesToDropDown(response);
    });
    request.open('GET', 'https://platform.whereismytransport.com/api/lines?agencies=' + agency, true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send();
}

function addLinesToDropDown(LinesList){
    var linesSelect = document.getElementById('lines-select');
    linesSelect.options.length = 0;
    linesSelect.options.add(new Option('Select an option',null, true, true));
    LinesList.forEach(function(line){
        linesSelect.options.add(new Option(line.name, line.id, false, false));
    });
}

function lineHandler(event){
    event.preventDefault();

    var lineSelect = document.getElementById('lines-select');
    var lineSelected = lineSelect.options[lineSelect.selectedIndex].value;

    console.log(lineSelected);
}


function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('storageDate');

    hideAll();
    showForm('login-form');
}

function hideForm(formId){
    document.getElementById(formId).style.display = 'none';
}

function hideAll(){
    hideForm('login-form');
    hideForm('agencies-form');
    hideForm('lines-form');
    hideForm('logout-form');
    hideForm('result');
}

function showForm(formId){
    document.getElementById(formId).style.display = 'block';
}

function showMap(){
    mapboxgl.accessToken = 'INSERT TOKEN HERE';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10'
    });
}

