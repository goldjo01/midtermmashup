var map;
var country;

//initializes the user interface
function initMap() {
  var uluru = {lat: 37.363, lng: -95.044};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: uluru
  });

  map.addListener('click', function(event) {
    newMarker(event.latLng);
  })
}
//array of markers that can be used on map
var allmarkers = []

//finds google maps components from JSON string returned from latLng values
function getCountry(latlng) {
    for (var i = 0; i < latlng.length; i++) {
        if (latlng[i].types[0] == "country") {
            return latlng[i].short_name;
        }
        if (latlng[i].types.length == 2) {
            if (latlng[i].types[0] == "political") {
                return latlng[i].short_name;
            }
        }
    }
    return false;
  }

//puts markers on the map
function setMapOnAll(map) {
    for (var i = 0; i < allmarkers.length; i++) {
      allmarkers[i].setMap(map); //puts markers on map
    }
  }

//adds marker, then triggers search for playlists
function newMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  country = getCountry(marker.getPosition()); //gets latlng value
  allmarkers.push(marker);
  searchPlaylists(country); //passes country on to search playlists
}

function clearMarkers() {
      setMapOnAll(null);
    }
    //similar functionality to redraw Table i think
function showMarkers() {
    setMapOnAll(map)
  }

function deleteMarkers() {
    clearMarkers();
    allmarkers = [];
  }
//-------------------------------------------------------------------------
var templateSource = document.getElementById('results-template'.innerHTML)
var resultsPlaceholder = document.getElementById('results')
var playingCssClass = 'playing'
var audioObject = null;

function authorize() {
  $.ajax({
    url:'http://localhost8087/'
  });
  $.ajax({
    url:'http://localhost8087/callback/q'
  });
}

function fetchTracks(playlistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/playlists/' + PlaylistId,
        success: function (response) {
            callback(response);
        }
    });
};

//searches spotify's database for playlists containing country name
 function searchPlaylists(query) {
  $.ajax({
    url: 'https://api.spotify.com/v1/search',
    data: {
      q: query,
      type: 'playlist'
    },
    success: function (response) {
      resultsPlaceholder.innerHTML = Handlebars.compile(templateSource);
    }
  })
}
//waits for a searh and does query if click occurs on search button. Meant to
//pull up playlist coverart if it exists, then play the song for 30 seconds as
//a preview.
document.getElementById('results').addEventListener('click', function (e) {
    var target = e.target;
    if (target !== null && target.classList.contains('cover')) {
        if (target.classList.contains(playingCssClass)) {
            audio.pause();
        } else {
            if (audio) {
                audio.pause();
            }
            fetchTracks(target.getAttribute('data-album-id'), function (data) {
                audio = new Audio(data.tracks.items[0].preview_url);
                audio.play();
                target.classList.add(playingCssClass);
                audio.addEventListener('ended', function () {
                    target.classList.remove(playingCssClass);
                });
                audio.addEventListener('pause', function () {
                    target.classList.remove(playingCssClass);
                });
            });
        }
    }
});

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchPlaylists(document.getElementById('query').value);
}, false);
