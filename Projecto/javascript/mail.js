
// reference your database
var contactFormDB = firebase.database().ref("contactForm");

document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var emailid = getElementVal("emailid");
  var phone = getElementVal("phone");
  var msgContent = getElementVal("msgContent");
  
  //verifica los datos que son enviados a firebase
  console.log("Datos a enviar a Firebase:", {
    name: name,
    emailid: emailid,
    phone: phone,
    msgContent: msgContent,
  });


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

