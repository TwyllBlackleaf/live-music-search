const apiKey = "AIzaSyCBXXx5-w_4lZfpsO2ifQOTCjgZ6mpPkD8";


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
