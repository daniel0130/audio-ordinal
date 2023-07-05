// get the requestId from the URL
var requestId = window.location.search.substring(1);
requestId = requestId.split("=")[1];

if (requestId.startsWith("bc1")) {
  // get element by id call inscriptionRequestId
  var inscriptionRequestId = document.getElementById("inscriptionRequestId");
  var isPaidFor = document.getElementById("isPaidFor");
  var inscriptionId = document.getElementById("inscriptionId");

  var url = "https://audionals-api.jim-2ac.workers.dev/status?id=" + requestId;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      inscriptionRequestId.innerHTML = data.id;
      isPaidFor.innerHTML = data.is_paid_for ? "Yes" : "No";
      inscriptionId.innerHTML = "";
      // foreach on data.request_items
      for (var i = 0; i < data.request_items.length; i++) {
        var htmlText = `Inscription ${
          i + 1
        } of request: <a href="https://ordinals.com/content/${
          data.request_items[i].inscription_id
        }">${data.request_items[i].inscription_id}</a><br />`;
        // append htmlText to inscriptionId
        inscriptionId.innerHTML += htmlText;
      }
    })
    .catch((error) => console.error("Error:", error));
}
