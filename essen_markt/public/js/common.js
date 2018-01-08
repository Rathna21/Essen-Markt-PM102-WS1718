
let userId= getQueryVariable("user");
let socket = io.connect('http://localhost:5000/');
//on connection with server socket
socket.on('connect', function(){
    // send the server, userId of the connected user
    console.log("emit");
    socket.emit('addUser',userId);
});
$(document).ready(() => {
    $('a.nav-link.link').attr("href", (n,v) =>{
        return v+"?user="+userId;
    });

    socket.on("donateRequest", function (data) {
        $("#snackbar").addClass("show");
        socketReceiver = data.receiverId;
    });
});
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]).replace(/\+/g, '');
        }
    }
    return undefined;
}
const getCurrentLocation = () => {
    let x = navigator.geolocation;
    x.getCurrentPosition(success, failure);

    function success(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        showMap(latitude, longitude);
    }

    function failure() {
        //setting latitude and longitude for Frankfurt
        showMap(50.110924, 8.682127);
    }
};

const showMap = (latitude, longitude) => {
    let map;
    let marker;
    let myLatlng = new google.maps.LatLng(latitude, longitude);

    let mapOptions = {
        zoom: 18,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("myMap"), mapOptions);

    marker = new google.maps.Marker({
        map: map,
        position: myLatlng,
        draggable: true
    });

    showAddressOnMarker(myLatlng, map, marker);

    google.maps.event.addListener(marker, 'dragend', function () {
        showAddressOnMarker(marker.getPosition(), map, marker);
    });
};

const showAddressOnMarker = (position, map, marker) => {
    let geocoder = new google.maps.Geocoder();
    let infowindow = new google.maps.InfoWindow();
    geocoder.geocode({'latLng': position}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                userAddress = results[0].formatted_address;
                userCity= results[0].address_components[3].long_name;
                userZipCode= results[0].address_components[6].long_name;
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            }
        }
    });
};

const sendResponse = (data) => {
    socket.emit("respondRequest", {
        result: data,
        receiverId: socketReceiver
    });
    $("#snackbar").removeClass("show");
};