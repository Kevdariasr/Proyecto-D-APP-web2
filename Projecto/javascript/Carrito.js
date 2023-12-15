
document.getElementById("viewSelector").addEventListener("change", function() {
  var selectedValue = this.value;
  if (selectedValue === "wine") {
    document.getElementById("wineView").style.display = "block";
    document.getElementById("beerView").style.display = "none";
  } else if (selectedValue === "beer") {
    document.getElementById("wineView").style.display = "none";
    document.getElementById("beerView").style.display = "block";
  }
});