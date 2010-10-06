function LiveStatsClient() {
    if (!(this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }

    var self = this;
    this.init = function() {
        var self = this;
        self.setupBayeuxHandlers();
    };

    this.setupBayeuxHandlers = function() {
        var self = this;
        $.getJSON("/config.json", function(config) {
            self.client = new Faye.Client("http://" + window.location.hostname + ":"
                    + config.port + '/faye', {
                timeout: 120
            });

            self.client.subscribe('/stat', function(message) {
                self.drawMarker(message);
            });
        });
    };

    this.drawMarker = function (message) {
    var self = this;
    var location = new google.maps.LatLng(message.latitude, message.longitude);
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    marker.setTitle(message.place);    
    var infowindow = new google.maps.InfoWindow({
        content: message.content
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
    };

    this.init();
}

function createMap(latlng, map_element) {
  var myOptions = {
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      navigationControl: true,
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.ZOOM_PAN
      },
      scaleControl: true
  };
  return newMap(map_element, myOptions);
}

function newMap(map_element, options) {
  return new google.maps.Map(map_element, options);
}

var liveStatsClient;
jQuery(function() {
    liveStatsClient = new LiveStatsClient();
});
