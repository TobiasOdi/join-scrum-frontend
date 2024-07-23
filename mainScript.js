// ================================================ VARIABLES ==========================================================
let users = [];
let tasks = [];
let subtasksLoad = [];
let assignedContacts = [];
/* let categories = [
    {
        "categoryName": "Marketing",
        "color": "rgb(0, 56, 255)",
        "categoryType": "default"
    },
    {
        "categoryName": "Media",
        "color": "rgb(255, 199, 2)",
        "categoryType": "default"
    },    {
        "categoryName": "Backoffice",
        "color": "rgb(31, 215, 193)",
        "categoryType": "default"
    },    {
        "categoryName": "Design",
        "color": "rgb(255, 122, 0)",
        "categoryType": "default"
    },    {
        "categoryName": "Sales",
        "color": "rgb(252, 113, 255)",
        "categoryType": "default"
    }
]; */

let id;

let black = "#000000";
let white = "#FFFFFF";
let orange = "#FF3D00";
let lightorange = "#FFA800";
let green = "#7AE229";  

/* ======================================================= INCLUDE HTML ========================================================== */
/**
 * This function adds the html template to the correct container.
 */
/* async function includeHTMLLogin() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
} */

/**
 * This function adds the html template to the correct container.
 */
//Source: https://developer-akademie.teachable.com/courses/902235/lectures/31232815
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    await init();
    counters();
}

// ================================================ INIT FUNCTION ==========================================================
/**
 * This function accesses the users, tasks and contacts data that is stored on the ftp server.
 */
 async function init() {
    try {
        tasks = await loadTasks();
        console.log("Tasks", tasks);
        subtasksLoad = await loadSubtasks();
        console.log("Subtasks", subtasksLoad);
        assignedContacts = await loadAssignedContacts();
        console.log("Assigned Contacts", assignedContacts);
        categories = await fetchCategories();
        console.log("Categories", categories);
        //contacts = loadUsers();
    } catch(e) {
        let error = 'Fehler beim Laden!';
        console.log(error);
    }
}

async function loadTasks() {
    const url = 'http://127.0.0.1:8000/tasks/';
    response = await fetch(url, {
        method: 'GET',
        headers:{'X-CSRFToken': 'sPmdfd5jrSLCvkIk5hW5WW2lJcsRyqPg'}
    });
    let data = await response.json();
    return data;
}

async function loadSubtasks() {
    const url = 'http://127.0.0.1:8000/subtasks/';
    response = await fetch(url, {
        method: 'GET',
        headers:{'X-CSRFToken': 'sPmdfd5jrSLCvkIk5hW5WW2lJcsRyqPg'}
    });
    let data = await response.json();
    return data;
}

async function loadAssignedContacts() {
    const url = 'http://127.0.0.1:8000/assignedTo/';
    response = await fetch(url, {
        method: 'GET',
        headers:{'X-CSRFToken': 'sPmdfd5jrSLCvkIk5hW5WW2lJcsRyqPg'}
    });
    let data = await response.json();
    return data;
}

async function fetchCategories() {
    const url = 'http://127.0.0.1:8000/categories/';
    response = await fetch(url, {
        method: 'GET',
        headers:{'X-CSRFToken': 'sPmdfd5jrSLCvkIk5hW5WW2lJcsRyqPg'}
    });
    let data = await response.json();
    return data;
}

/*
    setURL('/smallest_backend_ever');
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    categories = JSON.parse(backend.getItem('categories')) || [];
    setInterval(setUserColor, 200);
} */

    function setUserColor() {
        userColor = localStorage.getItem('userColor');
        console.log(userColor);
        setTimeout(() => {
            document.getElementById('topNavBarRightImgPicture').style.borderColor = userColor;
        }, 200);
    }


/**
 * This function sets the color of the user. Border around the user icon in the top right corner.
 */
/* function setUserColorOld() {
    if(window.location.href === 'https://join.tobias-odermatt.ch/index.html' + window.location.search) { // => IMMER ANPASSEN!!!
     let queryString = window.location.search.slice(4);
     //let urlId = parseInt(queryString);
 
     if(queryString) {
         //let existingUser = users.find(u => u.userId == urlId);
         //let currentUser = users.indexOf(existingUser);
         //let userColor = users[currentUser]['userColor'];
         document.getElementById('topNavBarRightImgPicture').style.borderColor = queryString;
     }
 }
}
 */
// ================================================ GENERAL FUNCTIONS ==========================================================
function getFirstletter(i) {
    firstLetters = "";
    let x = contacts[i]['name'];
    x = x.split(' ').map(word => word.charAt(0)).join('');
    let y = contacts[i]['surname'];
    y = y.split(' ').map(word => word.charAt(0)).join('');
    firstLetters = x.toUpperCase() + y.toUpperCase();
    return firstLetters;
}


// ================================================ SIGN UP ==========================================================
/**
 * This function adds a new user to the users array and saves it on the ftp server.
 */
async function addUser() {
    generateUserId();
    let name = document.getElementById('name');
    let surname = document.getElementById('surname');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    // let color = document.getElementById('color');
    let userId = id;
    let userColor = document.getElementById('userColor');
    let userColorValue = userColor.options[userColor.selectedIndex].value;
    let userData = {name: name.value, surname: surname.value, email: email.value, password: password.value, userColor: userColorValue, userId: userId};
    let contactData = {name: name.value, surname: surname.value, email: email.value, phone: '-', contactColor: userColorValue, contactId: userId};
    let user = users.find(u => u.email == email.value);
    validateSignup(userData, contactData, user, name, surname, email, password);
}

/**
 * This function generates the user id.
 */
function generateUserId() {
    id = Math.floor((Math.random() * 1000000) + 1);
    for (let i = 0; i < users.length; i++) {
        if (users[i]['userId'].includes === id || contacts[i]['contactId'].includes === id) {
            id = Math.floor((Math.random() * 1000000) + 1);
        }
    }
}

/**
 * This function validates the sign up form and throws an error if necessary.
 * @param {array} userData - array with all the user data
 * @param {array} contactData - array with all the user data for the contacts
 * @param {string} user - existing email address in the users array
 * @param {string} name - the name of the user
 * @param {string} surname - the surname of the user
 * @param {string} email - the email address of the user
 * @param {string} password - the passowrd of the user
 */
async function validateSignup(userData, contactData, user, name, surname, email, password) {
    if(user) {
        displaySnackbar('alreadySignedUp');
        name.value = '';
        surname.value = '';
        email.value = '';
        password.value = '';
    } else {
        users.push(userData);
        contacts.push(contactData);
        await saveUsers();
        await saveContacts();
        displaySnackbar('successfullySignedUp');
        setInterval(backToLoginScreen, 1200);
    } 
}
 /**
  * This function brings you back to the main login.html.
  */
function backToLoginScreen() {
    window.location.href = 'login.html'; // => IMMER ANPASSEN!!!
}

/**
 * This function exits the legal notice page.
 */
function exitLegalNoticePage() {
    document.querySelector('.mainLegalNoticeContainerDisplay').style.display = "none";

    if (document.getElementById("legalNoticeTopTab") !== null) {
        document.getElementById("legalNoticeTopTab").classList.remove('acitveHelpPage');
    }
    if (document.getElementById("legalNoticeTab") !== null) {
        document.getElementById("legalNoticeTab").classList.remove('activeLegalNoticeTab');
    }
}

/**
 * This function exits the help page.
 */
function exitHelpPage(){
    document.querySelector('.mainhelpContainerDisplay').style.display = "none";
    document.getElementById('pageHelpTab').classList.remove('acitveHelpPage');
}

/**
 * This function saves the user data in the users array on the ftp server.
 */
async function saveUsers() {
    let usersAsString = JSON.stringify(users);
    await backend.setItem('users', usersAsString);
}

// ================================================ LOGIN ==========================================================
/**
 * This event listener lets you lets you login with the enter key.
 */
window.addEventListener('keydown', (event) => {
    if(window.location.href === 'login.html') { // => IMMER ANPASSEN!!!
        if(event.keyCode == 13) {
            login();
        }
    }
});

/**
 * This function navigates you to the sign up screen.
 */
function goToSignup() {
    window.location.href = './signup.html';
}

/**
 * This function logs you into an existing user account.
 */
async function login() {
    disableFields();
    let emailLog = document.getElementById('emailLog');
    let passwordLog = document.getElementById('passwordLog');

    let fd = new FormData();
    //let token = '{{ csrf_token }}';
    const csrf_token = getCookie("csrftoken");
    localStorage.setItem('token', csrf_token);
    fd.append('email', emailLog.value);
    fd.append('password', passwordLog.value);
    fd.append('X-CSRFToken', csrf_token);
    console.log(csrf_token);
    if(emailLog.value == '' || passwordLog.value == '') {
        displaySnackbar('missingSignedUp');
    } else {
        try {
            let response = await fetch('http://127.0.0.1:8000/login/', {
              method: 'POST',
              body: fd
            });
            //localStorage.setItem('token', response['token']);
            console.log(response);
            let data = await response.json();
            console.log(data);
            //let json = JSON.parse(data);
            //console.log(json);
            if(data.status == 1) {
              displaySnackbar('pwEmailIncorrect');
            } else if(data.status == 2) {
                displaySnackbar('userDoesNotExist');
            } else {
                localStorage.setItem('userColor', data.userColor)
                window.location.href = "http://127.0.0.1:5500/index.html";
            }
            enableFields();  
          } catch(error) {
            console.log('An error occured', error);
            enableFields(); 
          }    
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function disableFields() {
    document.getElementById('emailLog').disabled = true;
    document.getElementById('passwordLog').disabled = true;
    document.getElementById('loginButton').disabled = true;
  }

function enableFields() {
    document.getElementById('emailLog').disabled = false;
    document.getElementById('passwordLog').disabled = false;
    document.getElementById('loginButton').disabled = false;  
}


/**
 * This function saves the name of the user in the local storage of the browser that is login in 
 * @param {array} user - uses array
 */
function setUserName(user) {
    let userName = user.name;
    localStorage.setItem('userName', userName);
    let userIdLogin = user.userid;
    localStorage.setItem('userIdLogin', userIdLogin);
}

/**
 * This function logs the user in as a guest (without email or password).
 */
function guestLogin() {
    let userName = "Guest";
    localStorage.setItem('userName', userName);
    window.location.href = 'index.html';
    let userIdLogin = '';
    localStorage.setItem('userIdLogin', userIdLogin);
}

/* ================================================================= FORGOT PASSWORD ================================================================= */
/**
 * This function validates the forgot password form and throws an error if necessary.
 */
async function checkForCorrectEmail(event) {
    event.preventDefault(); // Prevent default Form Action
    let sendEmailToResetPw = document.getElementById('sendEmailToResetPw').value;
    let formData = new FormData(event.target) // create a FormData based on our Form Element in HTML
    let response = await action(formData);
    if ((users.find(u => u.email == sendEmailToResetPw)) == null) {
        displaySnackbar('userDoesNotExist2');
        return false;
    }
    if(response.ok) {   
        displaySnackbar('sendEmail');
        document.getElementById('sendEmailToResetPw').value = '';
        setInterval(backToLoginScreen, 1200);
        console.log('Email was sent!');
    } else {
        console.log('Email not sent!');
    }
}

function action(formData) {
    const input = "https://join.tobias-odermatt.ch/send_mail.php"; // => immer anpassen!!
    const requestInit = {
        method: 'post',
        body: formData
    };

    return fetch (
        input,
        requestInit
    );
}

/* ================================================================= RESET PASSWORD ================================================================= */
/**
 * This function validates the reset password form and throws an error if necessary.
 */
function resetPassword() {
    let urlParams = new URLSearchParams(window.location.search);
    let userEmail = urlParams.get('email');
    let newPassword = document.getElementById('newPassword');
    let confirmPassword = document.getElementById('confirmPassword');
    let existingEmail = users.find(u => u.email == userEmail)
    let currentUser = users.indexOf(existingEmail);
    validatePassword(newPassword, confirmPassword, existingEmail, currentUser);
}

/**
 * This function validates the new password and throws an error if necessary.
 * @param {*} newPassword - input of the new passoword
 * @param {*} confirmPassword - input of the new confirmed password
 * @param {*} existingEmail - email adress of an existing user
 * @param {*} currentUser - index of the current user
 */
function validatePassword(newPassword, confirmPassword, existingEmail, currentUser) {
    if (newPassword.value == confirmPassword.value) {
        if (existingEmail) {
            users[currentUser]['password'] = confirmPassword.value;
            saveUsers();
            displaySnackbar('passwordReset');
            setInterval(backToLoginScreen, 1200);
        } else {
            displaySnackbar('userDoesNotExist3');
        }
    } else {
        displaySnackbar('passwordsNotIdentical');
    }
}

/* ================================================================= TOP BAR FUNCTIONS ================================================================= */
/**
 * This function shows and hides the logout button.
 */
function toggleLogoutButton() {
    let logoutButton = document.getElementById('logoutButton');
    if (logoutButton.style.display == "flex") {
        logoutButton.style.display = "none";
    } else {
        logoutButton.style.display = "flex";
    }
}

/**
 * This function logs the current user out and returns the user to the login page.
 */
function logout() {
    localStorage.removeItem("userName");
    window.location.href = 'login.html';
}

/* ================================================================= SIDE BAR FUNCTIONS ================================================================= */
/**
 * 
 * @param {*} func 
 * @param {*} delay 
 * @returns 
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * This function displays the html templates.
 * @param {string} pageId - id of the of the html template that needs to be displayed
 */
function displayPage(pageId) {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
    document.getElementById(pageId).style.display = "block";
}

/**
 * This function displays the legal notice page.
 */
function displayPageLegalNotice() {
    document.querySelector('.mainLegalNoticeContainerDisplay').style.display = "flex";
}

/**
 * This function displays the help page.
 */
function displayPageHelp() {
    document.querySelector('.mainhelpContainerDisplay').style.display = "flex";
}

/* ================================================================== SNACKBAR ================================================================= */
/**
 * This funktion displays the snackbars.
 * @param {string} popupId - id of the snackbar
 */
function displaySnackbar(popupId) {
    // Get the snackbar DIV
    var x = document.getElementById(popupId);
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

/* ================================================================= ACTIVE TAB ================================================================= */
/**
 * This functoon highlights the active tab on the side nav bar.
 */
function activeTab(tab) {
    let currentElement = document.getElementById(tab + "Tab");
    let allTabs = document.querySelectorAll('.tab');

    allTabs.forEach((element) => {
        element.classList.remove('activeTab');
    })
    if(currentElement !== null) {
        currentElement.classList.add('activeTab');
    }

    if (document.getElementById('pageHelpTab') !== null) {
        document.getElementById('pageHelpTab').classList.remove('acitveHelpPage');
    }
    if (document.getElementById('legalNoticeTab') !== null) {
        document.getElementById('legalNoticeTab').classList.remove('activeLegalNoticeTab');
    }
}

/**
 * This function highlights the icon of the legal notice pagea.
 */
function activeLegalNotice() {
    let legalNoticeTab = document.getElementById('legalNoticeTab');
    legalNoticeTab.classList.add('activeLegalNoticeTab');
}

/**
 * This function highlights the icon of the help page.
 */
function activeHelp(id) {
    let pageHelpTab = document.getElementById(id);
    pageHelpTab.classList.add('acitveHelpPage');
}

// ================================================ DATEN SPEICHERN ==========================================================
// IM LOCAL STORAGE
/* 
    allTasks.push(task);                                        => JSON mit Daten wird ins Array allTasks gepushed

    let allTasksAsString = JSON.stringify(allTasks);            => das Array allTasks wird in einen String umgewandelt
    localStorage.setItem('allTasks', allTasksAsString)          => Die Daten werden im Local Storage gespeichert / 'allTasks' ist der key und allTasksAsString ist der Wert der gespeichert wird 
*/

// AUF DEM SERVER
/* 
    let allTasksAsString = JSON.stringify(allTasks);
    backend.setItem('allTasks', allTasksAsString)
*/


// ================================================ DATEN LADEN ==========================================================
// VOM LOCAL STORAGE
/* 
    let allTasksAsString = localStorage.getItem('allTasks');    => Zugriff auf die Werte die unter dem key 'allTasks' gespeichert sind 
    allTasks = JSON.parse(allTasksAsString);                    => Die Werte werden wider von einem String in ein Array umgewandelt + Array allTasks wird überschrieben und die Werte eingefügt
*/

// VOM SERVER
/* 
    backend.setItem('users')    => Mehr Parameter nötig????
*/



