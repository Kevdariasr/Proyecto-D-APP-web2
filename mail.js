const firebaseConfig = {
    apiKey: "AIzaSyD8lVqNdIMDfltnhz4LDptf_gCf4DF6OIE",
    authDomain: "contactform-a0404.firebaseapp.com",
    databaseURL: "https://contactform-a0404-default-rtdb.firebaseio.com",
    projectId: "contactform-a0404",
    storageBucket: "contactform-a0404.appspot.com",
    messagingSenderId: "952180011710",
    appId: "1:952180011710:web:c3783227d098083fc1e4ef"
  };
  
// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var contactFormDB = firebase.database().ref("contactForm");

document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var emailid = getElementVal("emailid");
  var phone = getElementVal("phone");
  var msgContent = getElementVal("msgContent");
  
  saveMessages(name, emailid, phone, msgContent);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 4000);

  //   reset the form
  document.getElementById("contactForm").reset();
}

const saveMessages = (name, emailid, phone, msgContent) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    name: name,
    emailid: emailid,
    phone : phone,
    msgContent: msgContent,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

// Carrito

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
