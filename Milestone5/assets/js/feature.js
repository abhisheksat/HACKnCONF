var windowLocation = window.location.href.toString().split(window.location.host)[1];

function submitRSVPMayBe() {
  document.getElementById("hiddenurlmaybe").value = windowLocation;
  document.getElementById("rsvpmaybe").submit();
}

function submitRSVPYes() {
  document.getElementById("hiddenurlyes").value = windowLocation;
  document.getElementById("rsvpyes").submit();
}

function submitRSVPNo() {
  document.getElementById("hiddenurlno").value = windowLocation;
  document.getElementById("rsvpno").submit();
}

function myFunction() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      document.getElementById("connectionID").value = xmlHttp.responseText;
    }
  }
  xmlHttp.open("GET", "http://localhost:8084/conn", true); // true for asynchronous
  xmlHttp.send(null);
}
