//Google Maps API fetch & searchTerm Intergration 
function searchLocal(){
    var searchTerm = document.querySelector('#userInput').value;

    fetch(
        'https://www.google.com/maps/embed/v1/place?api_key=AIzaSyBcsR3u8CFQz51MueJdmvZvTyF8MWwvegw&q=' +
        searchTerm
    )
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var responseContainerEL = document.querySelector('#google-maps-section');
            var mapImg = document.createElement('img');
            mapImg.setAttribute('src', response.data.image_url);
            responseContainerEL.appendChild(mapImg);
        });
}