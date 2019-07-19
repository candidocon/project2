document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("login-btn").onclick = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition, showError);
      setTimeout(function() {
        //do what you need here
        document.getElementById("login-form").submit();
      }, 2000);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  };

  // function getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(showPosition, showError);
  //   } else {
  //     x.innerHTML = "Geolocation is not supported by this browser.";
  //   }
  // }

  // var myform = document.getElementById("login-form");
  // myform.onsubmit = function() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(setPosition, showError);
  //     return true;
  //   } else {
  //     x.innerHTML = "Geolocation is not supported by this browser.";
  //     return false;
  //   }
  // };
  function setPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    document.getElementById("latitude").value = latitude;
    document.getElementById("longitude").value = longitude;
    // alert("la: " + latitude + "lo: " + longitude);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred.";
        break;
    }
  }

  // function showPosition(position) {
  //   var lat = position.coords.latitude;
  //   var lon = position.coords.longitude;
  //   var latlon = new google.maps.LatLng(lat, lon);
  //   var mapholder = document.getElementById("mapholder");
  //   mapholder.style.height = "250px";
  //   mapholder.style.width = "100%";

  //   var myOptions = {
  //     center: latlon,
  //     zoom: 14,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //     mapTypeControl: false,
  //     navigationControlOptions: {
  //       style: google.maps.NavigationControlStyle.SMALL
  //     }
  //   };
  //   var map = new google.maps.Map(
  //     document.getElementById("mapholder"),
  //     myOptions
  //   );
  //   var marker = new google.maps.Marker({
  //     position: latlon,
  //     map: map,
  //     title: "You are here!"
  //   });
  // }
});
