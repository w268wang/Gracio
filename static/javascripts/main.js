var blueStyles = [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#101f2d"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"color":"#f9fcff"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#ffffff"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"lightness":16},{"weight":"0.28"},{"color":"#000000"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#a9b3ba"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"transit.station","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#51626f"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#67a2b9"}]}];
vex.defaultOptions.className = 'vex-theme-os';
aInfoWindow = new google.maps.InfoWindow;
userId = 0;
currentAddress = "";
currentName = "";
properAddress = "";
properName = "";

function incrementId() {
    userId++;
}

function getId() {
    // return userId;
    return Cookies.get("user_id");
}

function initialize(position) {
    if (Cookies.get("new_user") === "1") {
      firstTimeUserTypeModal();
    }
    var mapCanvas = document.getElementById('mapBox');
    console.log(position);
    var coordinates = new google.maps.LatLng(43.4667, -80.5167);
    if(position !== undefined) {
    	  console.log("exact coordinates used as map center");
        coordinates = new google.maps.LatLng(position.lat, position.lng);
    } else {
    	console.log("exact coordinates not used as map center");
    }
    var mapOptions = {
      center: coordinates,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(mapCanvas, mapOptions);
    map.setOptions({styles: blueStyles});
    setTimeout(function(){ getMarketData(coordinates); }, 2000);
}

function getMarketData(coordinates) {

//OAuth for Yelp API
 //  var oauth = OAuth({
 //    consumer: {
 //        public: 'a_dh2zZ-TW2obdtq1nSDww',
 //        secret: 'SECRET'
 //    },
 //    signature_method: 'HMAC-SHA1'
 //  });

	// var request_data = {
 //        url: 'http://api.yelp.com/v2/search/?term=Walmart&location=Waterloo&limit=3&cc=CA',
 //        method: 'GET',
 //    };

 //    var token = {
 //        public: '4j2OXIc6tcSgvc1Lq0XrCOkmHWVDkj2s',
 //        secret: 'SECRET'
 //    };

 //    $.ajax({
 //        url: request_data.url,
 //        type: request_data.method,
 //        data: oauth.toHeader(oauth.authorize(request_data, token))
 //    }).done(function(data) {
 //        //process your data here
 //        console.log(data);
 //  });
     
     //Google Places API Call
     console.log(coordinates);
     var latitude = coordinates.H;
     var longitude = coordinates.L;
     $.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + ", " + longitude +"&radius=5000&keyword=Sobeys&name=Sobeys&key=AIzaSyCdy-RgRgSlmHFzMeBPn5s_0wU5Ez1rJLE", function(data){
         console.log(data);
         var addressToName = {};
         for(var i = 0; i <= data['results'].length ; i++) {
         	 if(data['results'][i] !== undefined) {
         	 	 var address = (data['results'][i]).vicinity;
         	 }
             if(addressToName[address] === undefined) {
              	 addressToName[address] = (data['results'][i]).name;
             }
         }
         for(var x in addressToName) {
             console.log("In the hash map, key is :" + x  + " value is: " + addressToName[x]);
             addMarker(addressToName[x], x);
         }
     });

}

function addMarker(name, address) {
	var addressWithPlusSigns = address.replace(/\s/g, "+");
  var nameWithPlusSigns = name.replace(/\s/g, "+");
	console.log(addressWithPlusSigns);
  console.log("Address without Plus Signs is: " + address);
  console.log(nameWithPlusSigns);
  console.log("Name without Plus Signs is: " + name);
	$.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + addressWithPlusSigns + "&key=AIzaSyCdy-RgRgSlmHFzMeBPn5s_0wU5Ez1rJLE", function(data2){
		var lat = data2.results[0].geometry.location.lat;
		var lng = data2.results[0].geometry.location.lng;

		var myMarker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            clickable: true
        });
        myMarker.name = name;
        myMarker.address = address;
        currentAddress = addressWithPlusSigns;
        currentName = name;
        properAddress = address;
        properName = name;

        google.maps.event.addListener(myMarker, 'mouseover', function() {
            aInfoWindow.setContent(myMarker.name);
            aInfoWindow.open(map, myMarker);
        });

        google.maps.event.addListener(myMarker, 'mouseout', function() {
            aInfoWindow.close();
        });

        google.maps.event.addListener(myMarker, 'click', function() {
            console.log('clicked on marker for: ' + myMarker.name);
            openUserTypeModal();
        });
	});
}

function openUserTypeModal() {
    vex.dialog.open({
    	  showCloseButton: false,
    	  escapeButtonCloses: false,
    	  overlayClosesOnClick: false,
    	  message: "Store: " + currentName + ", Address is: " + properAddress + "\n - Are you a driver or a client?",
    	  buttons: [
              $.extend({}, vex.dialog.buttons.YES, {
                text: 'Driver'
              }), $.extend({}, vex.dialog.buttons.NO, {
                text: 'Client'
              })
          ],
          callback: function(data) {
          	  var userType;
              if(data === true) {
                  console.log("you are a driver");
                  userType = "driver";
              } else {
              	  console.log("you are a client");
                  userType = "client";
              }
              setTimeout(function() {
                  if(userType === "driver") {
                      driverModalDecision();
                  } else {
                      clientModalDecision();
                  }
              }, 500);
          }
    });
}

function firstTimeUserTypeModal() {
    vex.dialog.open({
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        message: "user id: " + getId(),
        input: "<input name='nickname' type='text' placeholder='Nickname' required /><input name='phonenumber' type='text' placeholder='Phone #'' required /><input name='email' type='text' placeholder='email' required />",
        buttons: [ 
              $.extend({}, vex.dialog.buttons.YES, {
                text: 'Confirm'
              })
          ],
          callback: function(data) {
              var userType;
              if(data === false) {
                firstTimeUserTypeModal();
              } else {
                  console.log("user_id: " + getId(), "nickname: " + data.nickname,
                    "phonenumber: " + data.phonenumber, "email: " + data.email);

                  $.get("http://54.152.97.131/fill_user?user_id=" + getId() + "&nickname="
                    + data.nickname + "&phonenumber=" + data.phonenumber +"&email=" + data.email
                    , function(data) {
                      console.log(data);
                  });
              }
          }
    });
}

function clientModalDecision() {
    vex.dialog.open({
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        message: "Would you like to Choose a Time or Choose a Driver?",
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Choose Time'
            }),
            $.extend({}, vex.dialog.buttons.NO, {
              text: 'Choose a Driver'
            })
        ],
        callback: function(data) {
            if(data === true) {
              //Call Modal for Time
              clientModalTime();
            } else {
              //Call Modal for Choosing Driver
              clientModalDriver();
            }
        }
    });
}

function clientModalTime() {
    vex.dialog.open({
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        message: "Please choose a time: ",
        //input: "<input name='username' type='text' placeholder='Time'/ required>",
        input: "<select><option value='10'>10 AM</option><option value='14'>2 PM</option>"
                   + "<option value='18'>6 PM</option><option value='22'>10 PM</option></select>",
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Submit'
            })
        ],
        callback: function(data) {
            console.log("The data val is : " + data);
            $.get("http://54.152.97.131/request_ride?user_id=" + getId() + "&time=2&target_address=" + currentAddress +"&quantity=2", function(data) {
                console.log(data);
            });
        }
    });
}

//Modal for Choosing Driver
function clientModalDriver() {
    $.get("http://54.152.97.131/get_provided_ride?target_address=" + currentAddress + "&time=2" , function(data) {
        console.log("Response of client looking for driver: " + data);
    });
    vex.dialog.open({
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        message: "Choose a driver: ",
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Done'
            })
        ],
        callback: function(data) {
            
        }
    });
}

function driverModalDecision() {
    vex.dialog.open({
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        message: "Would you like to Choose a Time or Choose a Client?",
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Choose Time'
            }),
            $.extend({}, vex.dialog.buttons.NO, {
              text: 'Choose a Client'
            })
        ],
        callback: function(data) {
            if(data === true) {
              //Call Modal for Time
              driverModalTime();
            } else {
              //Call Modal for Choosing Client
              driverModalClient();
            }
        }
    });
}

//Modal for Entering Time
function driverModalTime() {
    vex.dialog.open({
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        message: "Please select a time: ",
        //input: "<input name='username' type='text' placeholder='Time'/ required>",
        input: "<select><option value='10'>10 AM</option><option value='14'>2 PM</option>"
                   + "<option value='18'>6 PM</option><option value='22'>10 PM</option></select>",
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Submit'
            })
        ],
        callback: function(data) {
            console.log("The data val is : " + data);
            console.log("Value of GetID is : " + getId());
            $.get("http://54.152.97.131/provide_ride?user_id=" + getId() + "&time=2&target_address=" + currentAddress +"&quantity=2", function(data2) {
                console.log(data2);
            });
        }
    });
}

//Modal for Choosing Client
function driverModalClient() {
    vex.dialog.open({
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        message: "Choose a client: ",
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Done'
            })
        ],
        callback: function(data) {
            $.get("http://54.152.97.131/get_provided_ride?target_address=" + currentAddress + "&time=2" , function() {

            });
        }
    });
}

//Execution Start
if(navigator.geolocation) {
	console.log("Location attainable");
} else {
	console.log("Cannot get user location");
}
navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      setTimeout(function(){ initialize(pos); }, 3000);
      //map.setCenter(pos);
}, function() {
	  console.log("Browser permission has not been given. If local, run python -m SimpleHTTPServer");
	  var pos = undefined;
	  initialize(pos);
      //handleLocationError(true, infoWindow, map.getCenter());
});
//initialize();


