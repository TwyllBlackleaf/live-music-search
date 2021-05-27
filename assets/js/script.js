var searchTerm = {
    text: "",
    byBand: false,
    byLocation: false,

};

var getSearchTerm = function(event) {
    event.preventDefault();

    searchTerm.text = $("#search").val();
    searchTerm.byBand = $("#by-band").prop("checked");
    searchTerm.byLocation = $("#by-location").prop("checked");

    console.log(searchTerm);

    if (searchTerm.byBand) {
        searchByBand();
    } else if (searchTerm.byLocation) {
        searchByLocation();
    } else {
        console.log("error, please choose band or location");
    }
};

var searchByLocation = function() {
    console.log("searching by location");
};

var searchByBand = function() {
    console.log("searching by band");
};

$("#search-button").on("click", getSearchTerm);