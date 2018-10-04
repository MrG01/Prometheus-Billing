window.onload = function() {
    hideAll();

    if(hasToken()) {
        try {
            // get agencies
            getToken();
            showForm('journey-form');
        } catch(error) {
            console.log("unable to get token. There was an error" + error.message);
        }
    } else {
        showForm('login-form')
    }

    showMap();
    loadButtonEvents();
};

function loadButtonEvents(){
    var submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', loginHandler, false);

    var submitAgency = document.getElementById('submit-agency');
    submitAgency.addEventListener('click',agencyHandler, false);

    var submitLine = document.getElementById('submit-lines');
    submitLine.addEventListener('click', lineHandler, false);

    var logOutButton = document.getElementById('submit-logout');
    logOutButton.addEventListener('click', logout, false);

    var journeyButton = document.getElementById('submit-journey');
    journeyButton.addEventListener('click', journeyHandler, false);
}

function hasToken() {
    //CHECK if token exists in local storage

    var token = localStorage.getItem('token');
    var storageDate = localStorage.getItem('storageDate');

    if(token) {
        var convertedDate = parseInt(storageDate.replace(/,/gi,''));
        var dateNow = Date.now();

        if(convertedDate+3600*1000 < dateNow){
            logout();
            return false;
        }

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
    var clientId = document.getElementById('client-id');
    return clientId.value
}

function getClientSecret() {
    var clientSecret = document.getElementById('client-secret');
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
            localStorage.setItem('token', token);
            localStorage.setItem('storageDate', Date.now().toLocaleString());

            getAgencies(getToken());

            hideForm('login-form');
            showForm('journey-form');
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
        getLines(getToken());

        hideForm('agencies-form');
        showForm('lines-form');
    } catch(error){
        console.log("unable to get token. There was an error" + error.message);
    }
}

function getLines(token){
    var agency = getSelectedAgency();

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

    try {
        showStops(getToken());

        hideForm('lines-form');
        showForm('result');
    }catch(error){
        console.log("Unable to get line. An error has occured: " + error.message);
    }
}

function showStops(token){
    var agency = getSelectedAgency();
    var line = getSelectedLine();
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(){
        var response = JSON.parse(this.responseText);

        showMapWithStops(response);
    });
    request.open(
        'GET',
        'https://platform.whereismytransport.com/api/stops?agencies=' + agency
        + '&servesLines=' + line,
        true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send();
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
    hideForm('journey-form');
    hideForm('lines-form');
    hideForm('logout-form');
    //hideForm('result');
}

function showForm(formId){
    document.getElementById(formId).style.display = 'block';
}

function showMapWithStops(stopArray){
    var stopIndex = parseInt((stopArray.length/2)-1);
    var geo = stopArray[stopIndex].geometry;
    mapboxgl.accessToken = 'INSERT TOKEN HERE';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [geo.coordinates[0], geo.coordinates[1]],
        zoom: 12
    });

    map.on('load', () =>{
        addStops(map, stopArray);
    });
}

function showMap(){
    mapboxgl.accessToken = 'INSERT TOKEN HERE';
    window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [18.4241, -33.9249],
        zoom: 12
    });

    window.startPin = new mapboxgl.Marker().setLngLat([0,0]).addTo(window.map);
    window.destinationPin = new mapboxgl.Marker().setLngLat([0,0]).addTo(window.map);

    window.map.on('click', function(event){
        console.log(event.lngLat);

        if(window.isStart === true){
            window.destinationPin.setLngLat(event.lngLat);
            window.isStart = false;
            document.getElementById('destination').value = event.lngLat.lng + ',' + event.lngLat.lat;
        } else {
            window.startPin.setLngLat(event.lngLat);
            window.isStart = true;
            document.getElementById('start').value = event.lngLat.lng + ',' + event.lngLat.lat;
        }
    });

}

function journeyHandler(event){
    event.preventDefault();
}

function addStops(map, stops){
    var startPoint = stops[0].geometry.coordinates;
    var endPoint = stops[stops.length -1].geometry.coordinates;

    //Directions
    getDirections(map, startPoint, endPoint);
    //Directions

    map.addLayer({
        id: 'start',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: startPoint
                }
            }
        }
    });
    map.addLayer({
        id: 'end',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: endPoint
                }
            }
        }
    });
// this is where the JavaScript from the next step will go
}

function getDirections(map, startPoint, endPoint){
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(){
        var response = JSON.parse(this.responseText);

        addMapLine(map, response.routes[0].geometry);
    });
    request.open(
        'GET',
        'https://api.mapbox.com/directions/v5/mapbox/driving/'
        + startPoint[0] + ',' + startPoint[1] + ';' + endPoint[0] + ',' + endPoint[1] +
        '?geometries=geojson&access_token=' + mapboxgl.accessToken,
        true);
    request.setRequestHeader('Accept', 'application/json');
    request.send();
}

function addMapLine(map, geo){
    //Directions
    map.addLayer({
        id: 'route',
        type: 'line',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: geo
            }
        },
        paint: {
            'line-width': 2
        }
    });
    // this is where the code from the next step will go
    //Directions
}

function getSelectedAgency(){
    var agencies = document.getElementById('agencies-select');
    return agencies.options[agencies.selectedIndex].value;
}

function getSelectedLine(){
    var linesSelect = document.getElementById('lines-select');
    return linesSelect.options[linesSelect.selectedIndex].value;
}

