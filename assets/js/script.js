var searchTerm = {
    text: "",
    byBand: false,
    byLocation: false,

};

var resultsListEl = $("#results-list");

var getSearchTerm = function(event) {
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

var searchByLocation = function() {
    console.log("searching by location");


};

var searchByBand = function() {
    console.log("searching by band");

    fetch("https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchTerm.text + "&apikey=FzG0HQggXUshU8XPjoL51Vx9xKDyW0r9")
        .then(function(response) {
            return response.json();
        })
        .then(function(response){
            console.log(response._embedded.events);
            var eventsArray = response._embedded.events;
            for (i = 0; i < eventsArray.length; i++) {
                $(`<li class="block" id="${eventsArray[i].id}"><a href="./results.html?id=${eventsArray[i].id}">${eventsArray[i].name}</a></li>`).appendTo(resultsListEl);
            }
        })    
};

$("#search-button").on("click", getSearchTerm);