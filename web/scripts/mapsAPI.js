function insert_meetup(data) {
    if (!data) {
        $("#error-message").val('Location information was invalid, please try again.')
        return;
    }
    console.log(data[0]);
    console.log(data[0].geometry.location.lat());
    var j = {
        name: $("#name").val(),
        location: data[0].formatted_address,
        latitude: data[0].geometry.location.lat(),
        longitude: data[0].geometry.location.lng(),
        date_of_meetup: $("#dateof").val(),
        start_time: $("#starttime").val(),
        end_time: $("#endtime").val(),
        organizer: 'Veteran\'s Charity'
    };
    firebase.database().ref('meetups/' + firebase.database().ref().child('meetup').push().key).set(j);
    console.log(j);
}

function getLocation(location) {
    //var api_key = 'AIzaSyBZbBxoI3QSdk7LGcJc9BGazii8BA5mQbM';
    request = {
        query: location,
        fields: ['name', 'geometry', 'formatted_address']
    }
    var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, insert_meetup);
}

function getAllMeetups(map) {
    var leadsRef = firebase.database().ref('meetups');
    var objs = []
    var group = new H.map.Group(objs);
    leadsRef.on('value', function (snapshot) {
        console.log(snapshot);
        snapshot.forEach(function (childSnapshot) {
            var item = childSnapshot.val();
            console.log(item);
            var dp = new H.clustering.DataPoint(item.latitude, item.longitude);
            dp.data = item;

            objs.push(dp);

        });
        var clusteredDataProvider = new H.clustering.Provider(objs, {
            clusteringOptions: {
                // Maximum radius of the neighbourhood
                eps: 32,
                // minimum weight of points required to form a cluster
                minWeight: 2
            }
        });
        var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
        clusteredDataProvider.addEventListener('tap', function (evt) {
            var data = evt.target;
            console.log(evt);
            var data = evt.target.getData().a.data;
            console.log(data);
            $("#modal-info").modal();

            $("#organizer").html(data.organizer?data.organizer:"");
            $("#event").html(data.name?data.name:"");
            $("#address").html(data.location?data.location:"");
            $("#dateof").html(data.date_of_meetup?data.date_of_meetup:"");
            $("#time").html((data.start_time?data.start_time:"") + " to " + (data.end_time?data.end_time:""));
        }, false);
        map.addLayer(clusteringLayer);
    });
}
