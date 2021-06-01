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
    long: 0
};

var resultsListEl = $("#results-list");

//S2. Google Maps Handling
//Google Maps API fetch & searchTerm Intergration 
function searchLocal() {
    var searchTerm = document.querySelector('#userInput').value;

    fetch(
        'https://www.google.com/maps/embed/v1/place?api_key=AIzaSyBcsR3u8CFQz51MueJdmvZvTyF8MWwvegw&q=' +
        searchTerm
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var responseContainerEL = document.querySelector('#google-maps-section');
            var mapImg = document.createElement('img');
            mapImg.setAttribute('src', response.data.image_url);
            responseContainerEL.appendChild(mapImg);
        });
}

// S3. Search Form Handling
var getSearchTerm = function (event) {
    event.preventDefault();

    searchTerm.text = $("#search").val();
    searchTerm.byBand = $("#by-band").prop("checked");
    searchTerm.byLocation = $("#by-location").prop("checked");

    console.log(searchTerm);

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

var searchByLocation = function () {
    console.log("searching by location");


};

var searchByBand = function () {
    console.log("searching by band");

    fetch("https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchTerm.text + "&apikey=FzG0HQggXUshU8XPjoL51Vx9xKDyW0r9")
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response._embedded.events);
            var eventsArray = response._embedded.events;
            for (i = 0; i < eventsArray.length; i++) {
                $(`<li class="block" id="${eventsArray[i].id}"><a href="./results.html?id=${eventsArray[i].id}">${eventsArray[i].name}</a></li>`).appendTo(resultsListEl);
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

//favorites by localstorage
let results = []

const FAVORITES_STORAGE_KEY = 'favorites'

if (localStorage.getItem(FAVORITES_STORAGE_KEY)) {
    results = localStorage.getItem(FAVORITES_STORAGE_KEY)
}

results = [ "band", "music", "live" ]

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

$(".button.is-success").click(() => {
    $(".button.is-success")
    $(".modal").removeClass("is-active")
    window.location.href = 'results.html?favorites=' + selected
});













