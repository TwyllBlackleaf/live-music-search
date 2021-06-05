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
            img.className = "imgResize";
            img.src = imgUrl;
            let bandInfo = document.getElementsByClassName("bandInfo")[0];
            bandInfo.appendChild(img)

     

            let showTimes = document.getElementsByClassName("show-times")[0];
            showTimes.className = "showTimesAdj";

            let showTimesMarkup = document.createElement("p");
            showTimesMarkup.className = "showTimesMarkupAdj";


            showTimesMarkup.textContent += localDate + localTime;

            showTimes.appendChild(showTimesMarkup);


              let getLatitude = response._embedded.venues[0].location.latitude;
              let getLongitude = response._embedded.venues[0].location.longitude;
              
              
                map = new google.maps.Map(document.getElementById("map"), {
                center: {lat: +getLatitude, lng: +getLongitude},
                zoom: 20,
                
               });
             const panorama = new google.maps.StreetViewPanorama(
               document.getElementById("pano"),
                {
                  position: {lat: +getLatitude, lng: +getLongitude},
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
