const apiKey = "AIzaSyCBXXx5-w_4lZfpsO2ifQOTCjgZ6mpPkD8";

var getTicketmasterInfo = function() {
    var id = document.location.search;
    id = id.split("=")[1];



    fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}?apikey=FzG0HQggXUshU8XPjoL51Vx9xKDyW0r9`)
        .then(function(response) {
            return(response.json());
        })
        .then(function(response) {

          // this gets the dateTime from the json object returned by the fetch call 

            let localDate = response.dates.start.localDate;
            let localTime = response.dates.start.localTime;

            let imgUrl = response.images[0].url;
            img = document.createElement("img");
            img.src = imgUrl;
            let bandInfo = document.getElementsByClassName("bandInfo")[0];
            bandInfo.appendChild(img)

     

            let showTimes = document.getElementsByClassName("show-times")[0];

            let showTimesMarkup = document.createElement("p");

    

            showTimesMarkup.textContent += localDate + localTime;

            showTimes.appendChild(showTimesMarkup);

            

            



              let getLocation = response. _embedded.venues.location;
              console.log(getLocation);
              const map = new google.maps.Map(document.getElementById("map"), {
                center: getLocation,
                zoom: 20,
              });
              const panorama = new google.maps.StreetViewPanorama(
                document.getElementById("pano"),
                {
                  position: getLocation,
                  pov: {
                    heading: 18,
                    pitch: 10,
                  },
                }
              );
              map.setStreetView(panorama);
            

            
        })
}



  getTicketmasterInfo();
