const apiKey = "AIzaSyCBXXx5-w_4lZfpsO2ifQOTCjgZ6mpPkD8";

var getTicketmasterInfo = function() {
    var id = document.location.search;
    id = id.split("=")[1];

    fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}?apikey=FzG0HQggXUshU8XPjoL51Vx9xKDyW0r9`)
        .then(function(response) {
            return(response.json());
        })
        .then(function(response) {
            console.log(response);
        })
}

function initialize() {
    const fenway = { lat: 36.161248, lng: -86.778471 };
    const map = new google.maps.Map(document.getElementById("map"), {
      center: fenway,
      zoom: 20,
    });
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"),
      {
        position: fenway,
        pov: {
          heading: 18,
          pitch: 10,
        },
      }
    );
    map.setStreetView(panorama);
  }


  getTicketmasterInfo();
