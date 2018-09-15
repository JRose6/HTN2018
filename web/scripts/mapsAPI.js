function insert_meetup(data){
    if (data[0]==null){
        $("#error-message").val('Location information was invalid, please try again.')
        return;
    }
    console.log(data[0]);
    console.log(data[0].geometry.location.lat());
    var j = {   name: $("#name").val(),
                location: data[0].name,
                latitude: data[0].geometry.location.lat(),
                longitude: data[0].geometry.location.lng(),
                date_of_meetup: $("#dateof").val(),
                start_time: $("#starttime").val(),
                end_time: $("#endtime").val(),
                organizer: 'Jordan Rose\'s Charity of Awesome'};
    firebase.database().ref('meetups/' + firebase.database().ref().child('meetup').push().key).set(j);
    console.log(j);
}

function getLocation(location){
    //var api_key = 'AIzaSyBZbBxoI3QSdk7LGcJc9BGazii8BA5mQbM';
    //var url_request =  'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'&key='+api_key;
    request = {
        query: location,
        fields: ['name','geometry']
    }
    var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
      });
  
    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, insert_meetup);   
}

function getAllMeetups(){

}