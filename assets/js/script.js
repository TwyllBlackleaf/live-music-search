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
    firstLong: 0,
    startDate: 0,
    endDate: 0,
    genre: ""
};

//favorites from local storage
const FAVORITES_STORAGE_KEY = 'favorites'
let results = []


if (localStorage.getItem(FAVORITES_STORAGE_KEY)) {
    results = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY))
    console.log(results, "results");
} 

favoritesSearch();

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
    searchTerm.startDate = $("#start-date").val();
    searchTerm.endDate = $("#end-date").val();

    console.log(searchTerm);

    results.push(searchTerm.text)
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(_.uniq(results)));
    favoritesSearch();

    //Error Modal js
    var blModal = document.getElementById("b/lMod");
    var blBtn = document.getElementById("search-button");
    var modal = document.getElementById("eSearch");
    var btn = document.getElementById("search-button");
    // Get the <span> element that closes the modal
    var span1 = document.getElementsByClassName("close1")[0];
    var span = document.getElementsByClassName("close")[0];
    if (searchTerm.text) {
        if (searchTerm.byBand) {
            searchByBand();
        } else if (searchTerm.byLocation) {
            searchByLocation();
        } else {
        // When the user clicks on the button, open the modal
            blModal.style.display = "block";
        // When the user clicks on <span> (x), close the modal
            span1.onclick = function() {
             blModal.style.display = "none";
            }
        // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == blModal) {
                    blModal.style.display = "none";
                }
            }
            console.log("error, please choose band or location");
        }
    } else {
        // When the user clicks on the button, open the modal
            modal.style.display = "block";
        // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
            modal.style.display = "none";
            }
        // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        console.log("error, please enter a search term");
    }

};

var searchByLocation = function() {

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({"address": searchTerm.text}, function(results) {
        searchTerm.lat = results[0].geometry.location.lat();
        searchTerm.long = results[0].geometry.location.lng();
        console.log(searchTerm);

        var locationSearchUrl = `https://app.ticketmaster.com/discovery/v2/events.json?latlong=${searchTerm.lat},${searchTerm.long}&apikey=FzG0HQggXUshU8XPjoL51Vx9xKDyW0r9&radius=25&classificationName=music`

        if (searchTerm.startDate) {
            var startDateMoment = moment(searchTerm.startDate)._i;
            locationSearchUrl += "&startDateTime=" + startDateMoment + "T00:00:00Z";
        }

        if (searchTerm.endDate) {
            var endDateMoment = moment(searchTerm.endDate)._i;
            locationSearchUrl += "&endDateTime=" + endDateMoment + "T23:59:59Z";
        }

        if ($("#genre").val()) {
            var genreId = $("#genre").val();
            locationSearchUrl += "&genreId=" + genreId;
        }

        fetch(locationSearchUrl)
            .then(function(response) {
                return(response.json());
            })
            .then(function(response) {
                console.log(response._embedded.events);
                var eventsArray = response._embedded.events;
                var map1 = initMap();

                var bounds = new google.maps.LatLngBounds();

                for (i = 0; i < eventsArray.length; i++) {
                    if (eventsArray[i]._embedded) {
                        for (j = 0; j < eventsArray[i]._embedded.venues.length; j++) {
                            var eventLocation = eventsArray[i]._embedded.venues[j].name;
    
                            if (eventsArray[i].dates.initialStartDate) {
                                var eventStartDate = eventsArray[i].dates.initialStartDate.localDate;
                                $(`<li class="block" id="${eventsArray[i].id}"><a href="./results.html?id=${eventsArray[i].id}">${eventsArray[i].name}
                                     at ${eventLocation} starting on ${eventStartDate}</a></li>`).appendTo(resultsListEl);
                            } else {
                                $(`<li class="block" id="${eventsArray[i].id}"><a href="./results.html?id=${eventsArray[i].id}">${eventsArray[i].name}
                                     at ${eventLocation}</a></li>`).appendTo(resultsListEl);
                            }
                            
                            if (eventsArray[i]._embedded.venues[j].location) {
                                var markerLatLng = { 
                                    lat: parseFloat(eventsArray[i]._embedded.venues[j].location.latitude),
                                    lng: parseFloat(eventsArray[i]._embedded.venues[j].location.longitude)
                                }
            
                                new google.maps.Marker({
                                    position: markerLatLng,
                                    map: map1,
                                    title: eventLocation
                                })
    
                                bounds.extend(markerLatLng);
                            }
                        }

                    }
                    
                }

                map1.fitBounds(bounds); 
            })
    })
};

var searchByBand = function() {
    var bandSearchUrl = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchTerm.text + "&apikey=FzG0HQggXUshU8XPjoL51Vx9xKDyW0r9";

    if (searchTerm.startDate) {
        var startDateMoment = moment(searchTerm.startDate)._i;
        bandSearchUrl += "&startDateTime=" + startDateMoment + "T00:00:00Z";
    }

    if (searchTerm.endDate) {
        var endDateMoment = moment(searchTerm.endDate)._i;
        bandSearchUrl += "&endDateTime=" + endDateMoment + "T23:59:59Z";
    }

    fetch(bandSearchUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response._embedded.events);
            var eventsArray = response._embedded.events;
            searchTerm.firstLat = eventsArray[0]._embedded.venues[0].location.latitude;
            searchTerm.firstLong = eventsArray[0]._embedded.venues[0].location.longitude;

            var map1 = initMap();

            var bounds = new google.maps.LatLngBounds();
            

            for (i = 0; i < eventsArray.length; i++) {
                if (eventsArray[i]._embedded) {
                    for (j = 0; j < eventsArray[i]._embedded.venues.length; j++) {
                        var eventLocation = eventsArray[i]._embedded.venues[j].name
    
                        if (eventsArray[i].dates.initialStartDate) {
                            var eventStartDate = eventsArray[i].dates.initialStartDate.localDate;
                            $(`<li class="block" id="${eventsArray[i].id}"><a href="./results.html?id=${eventsArray[i].id}">${eventsArray[i].name}
                                 at ${eventLocation} starting on ${eventStartDate}</a></li>`).appendTo(resultsListEl);
                        } else {
                            $(`<li class="block" id="${eventsArray[i].id}"><a href="./results.html?id=${eventsArray[i].id}">${eventsArray[i].name}
                                 at ${eventLocation}</a></li>`).appendTo(resultsListEl);
                        }
    
                        if (eventsArray[i]._embedded.venues[j].location) {
                            var markerLatLng = { 
                                lat: parseFloat(eventsArray[i]._embedded.venues[j].location.latitude),
                                lng: parseFloat(eventsArray[i]._embedded.venues[j].location.longitude)
                            }
        
                            new google.maps.Marker({
                                position: markerLatLng,
                                map: map1,
                                title: eventLocation
                            })
    
                            bounds.extend(markerLatLng);
                        }
                    }
                }
                
            }

            map1.fitBounds(bounds); 
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















