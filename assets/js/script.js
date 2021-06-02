// Table of Contents
// S1. Global Variables
// S2. Google Maps Handling
// S3. Search Form Handling
// S4. Event Listeners

// S1. Global Variables
var searchTerm = {
    text: "",
    byBand: false,
    byLocation: false,
    lat: 0,
    long: 0,
    firstLat: 0,
    firstLong: 0
};

//favorites from local storage
const FAVORITES_STORAGE_KEY = 'favorites'
let results = []


if (localStorage.getItem(FAVORITES_STORAGE_KEY)) {
    results = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY))
    console.log(results);
} 


var resultsListEl = $("#results-list");


//S2. Google Maps Handling

function initMap() {
    // Default to centering the map on Vanderbilt
    var mapCenter = { lat: 36.1447034, lng: -86.8048491 };

    if (searchTerm.byBand) {
        // If searching by band, center the map on the location of the first event's venue
        mapCenter.lat = parseFloat(searchTerm.firstLat); 
        mapCenter.lng = parseFloat(searchTerm.firstLong);
    } else if (searchTerm.byLocation) {
        // If searching by location, set the center of the map to the searched location
        mapCenter.lat = searchTerm.lat;
        mapCenter.lng = searchTerm.long;
    }

    // Initialize the map
    var map = new google.maps.Map(document.getElementById("google-maps-section"), {
        zoom: 10,
        center: mapCenter,
    });

    return map;

}

function addMarkerMap(location, label, map) {

new google.maps.Marker({
    position: location,
    label: label,
    map: map,
    });
    
}

// S3. Search Form Handling
var getSearchTerm = function(event) {
    event.preventDefault();

    $("#results-list").text("");

    searchTerm.text = $("#search").val();
    searchTerm.byBand = $("#by-band").prop("checked");
    searchTerm.byLocation = $("#by-location").prop("checked");

    console.log(searchTerm);

    results.push(searchTerm.text)
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(results));
    favoritesSearch();

    
    if (searchTerm.text) {
        if (searchTerm.byBand) {
            searchByBand();
        } else if (searchTerm.byLocation) {
            searchByLocation();
        } else {
            // insert error modal here
            console.log("error, please choose band or location");
        }
    } else {
        // insert error modal here
        console.log("error, please enter a search term");
    }

};

var searchByLocation = function() {
    console.log("searching by location");

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({"address": searchTerm.text}, function(results) {
        searchTerm.lat = results[0].geometry.location.lat();
        searchTerm.long = results[0].geometry.location.lng();
        console.log(searchTerm);

        fetch(`https://app.ticketmaster.com/discovery/v2/events.json?latlong=${searchTerm.lat},${searchTerm.long}&apikey=FzG0HQggXUshU8XPjoL51Vx9xKDyW0r9&radius=25&classificationName=music`)
            .then(function(response) {
                return(response.json());
            })
            .then(function(response) {
                console.log(response._embedded.events);
                var eventsArray = response._embedded.events;
                var map1 = initMap();

                for (i = 0; i < eventsArray.length; i++) {
                    for (j = 0; j < eventsArray[i]._embedded.venues.length; j++) {
                        var eventLocation = eventsArray[i]._embedded.venues[j].name

                        $(`<li class="block" id="${eventsArray[i].id}"><a href="./results.html?id=${eventsArray[i].id}">${eventsArray[i].name} at ${eventLocation}</a></li>`).appendTo(resultsListEl);
                        
                        if (eventsArray[i]._embedded.venues[j].location) {
                            var markerLatLng = { 
                                lat: parseFloat(eventsArray[i]._embedded.venues[j].location.latitude),
                                lng: parseFloat(eventsArray[i]._embedded.venues[j].location.longitude)
                            }
                            console.log(markerLatLng);
        
                            new google.maps.Marker({
                                position: markerLatLng,
                                map: map1,
                                title: eventLocation
                            })
                        }
                    }
                }

                
            })
    })
};

var searchByBand = function() {
    console.log("searching by band");

    fetch("https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchTerm.text + "&apikey=FzG0HQggXUshU8XPjoL51Vx9xKDyW0r9")
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response._embedded.events);
            var eventsArray = response._embedded.events;
            searchTerm.firstLat = eventsArray[0]._embedded.venues[0].location.latitude;
            searchTerm.firstLong = eventsArray[0]._embedded.venues[0].location.longitude;

            var map1 = initMap();
            

            for (i = 0; i < eventsArray.length; i++) {
                for (j = 0; j < eventsArray[i]._embedded.venues.length; j++) {
                    var eventLocation = eventsArray[i]._embedded.venues[j].name
                    $(`<li class="block" id="${eventsArray[i].id}"><a href="./results.html?id=${eventsArray[i].id}">${eventsArray[i].name} at ${eventLocation}</a></li>`).appendTo(resultsListEl);
                    
                    console.log(eventsArray[i]._embedded.venues[j].location);

                    if (eventsArray[i]._embedded.venues[j].location) {
                        var markerLatLng = { 
                            lat: parseFloat(eventsArray[i]._embedded.venues[j].location.latitude),
                            lng: parseFloat(eventsArray[i]._embedded.venues[j].location.longitude)
                        }
                        console.log(markerLatLng);
    
                        new google.maps.Marker({
                            position: markerLatLng,
                            map: map1,
                            title: eventLocation
                        })
                    }
                     

                    

                }
            }


            
        })    
};

// S4. Event Listeners
$("#search-button").on("click", getSearchTerm);


//modal

//close out modal
var modalCloseButton = $("button.delete");
console.log(modalCloseButton);

modalCloseButton.click(() => {
    $(".is-active").removeClass("is-active")
    console.log($(".modal.is-active"));
});


//set modal to favorites button
var favoritesButton = $("#favorites-button");

favoritesButton.click(() => {
    $(".modal").addClass("is-active");
});


//use cancel to close out modal
var modalCancelButton = $("#cancel");
console.log(modalCancelButton);

modalCancelButton.click(() => {
    $(".is-active").removeClass("is-active")
    console.log($(".modal.is-active"));
});

// dropdown acctivation
var dropDownActive = $(".dropdown");

dropDownActive.click(() => {
    dropDownActive.addClass("is-active")
});


function favoritesSearch() {

html = ""
for (let i = 0; i < results.length; i++) {
    html += `
     <a href="#" id="favorite-search${ i }" class="dropdown-item">
     ${ results [ i ] }
     </a>
     `
}

$(".dropdown-content").html(html)

var selected;
var favoriteSearchEl = $(".dropdown-item").click((e) => {
  selected = $("#" + e.target.id).html().trim()
  e.stopPropagation();
  $(".dropdown").removeClass("is-active") 
  $(".dropdown-trigger button span:first-child").html(selected)
});

$(".button.is-success").click((e) => {
    e.stopPropagation()
    $(".button.is-success")
    $(".modal").removeClass("is-active")
    $(".input#search").val(selected)
});

};















