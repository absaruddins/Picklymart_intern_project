
// NOTE: This is a DEMO login system using localStorage
// (data is saved inside the browser only).
// A real website needs a backend and a database.


function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// user who is logged in 
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}



const page = document.body;
const user = getLoggedInUser();

// NOT logged in then go to login page
if (page.dataset.protected === "true" && !user) {
  window.location.href = "login.html";
}

// already logged in then go to home page
if (page.dataset.guest === "true" && user) {
  window.location.href = "index.html";
}


// ===== Load navbar.html and footer.html into the page =====


function loadFile(fileName, divId) {
  return fetch(fileName)                     
    .then(response => response.text())       
    .then(data => {
      document.getElementById(divId).innerHTML = data;  
    });
}

// Load both files, then update the navbar
Promise.all([
  loadFile("navbar.html", "navbar"),
  loadFile("footer.html", "footer")
]).then(updateNavbar);


// ===== Update the navbar (Login/Registration OR Logout) =====

function updateNavbar() {
  const guestLinks = document.getElementById("guestLinks");
  const userLinks = document.getElementById("userLinks");

  if (user) {
    // hide Login/Registration
    guestLinks.classList.add("d-none");
    userLinks.classList.remove("d-none");
    document.getElementById("userName").textContent = user.name;

    // Logout button: remove the logged in user, then go to login page
    document.getElementById("logoutBtn").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }
}


// =====  Show an error message =====

function showMessage(text) {
  const box = document.getElementById("message");
  box.textContent = text;
  box.classList.remove("d-none");   // make the message box visible
}


// =====  Register form =====

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();   // stop the page from reloading

    // If the form has errors (empty fields, wrong email...) show Bootstrap validation
    if (!registerForm.checkValidity()) {
      registerForm.classList.add("was-validated");
      return;
    }

    
    const inputs = registerForm.querySelectorAll("input");
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim().toLowerCase();
    const phone = inputs[2].value.trim();
    const password = inputs[3].value;

    // Check if this email is already registered
    const users = getUsers();
    const alreadyExists = users.some(u => u.email === email);

    if (alreadyExists) {
      showMessage("This email is already registered. Please login.");
      return;
    }

    // Save the new user
    users.push({ name: name, email: email, phone: phone, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    // login page
    alert("Registration successful! Please login.");
    window.location.href = "login.html";
  });
}


// ===== Login form =====

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!loginForm.checkValidity()) {
      loginForm.classList.add("was-validated");
      return;
    }

    const inputs = loginForm.querySelectorAll("input");
    const email = inputs[0].value.trim().toLowerCase();
    const password = inputs[1].value;

    // Look for a user with the same email AND password
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      showMessage("Wrong email or password. If you are new, please register first.");
      return;
    }

    // Login success
    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    window.location.href = "index.html";
  });
}


// ===== Given a success message) =====

const contactForm = document.querySelector(".my-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.classList.add("was-validated");
      return;
    }

    alert("Message sent successfully!");
    contactForm.reset();
    contactForm.classList.remove("was-validated");
  });
}
