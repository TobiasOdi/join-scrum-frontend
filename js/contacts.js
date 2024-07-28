// ================================================ VARIABLES ==========================================================
let contactsRaw = []
let contacts = [];
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let contactName = document.getElementById('contactName');
let contactSurname = document.getElementById('contactSurname');
let contactEmail = document.getElementById('contactEmail');
let contactPhone = document.getElementById('contactPhone');
let contactPhoneValue;
let idContact;

let editName = document.getElementById('editContactName');
let editSurname = document.getElementById('editContactSurname');
let editEmail = document.getElementById('editContactEmail');
let editPhone = document.getElementById('editContactPhone');

let newContactPopUp = document.getElementById('addContactBackground');
let editContactPopUp = document.getElementById('editContactBackground');

let bgColor;
let firstLetters;

// ================================================ INIT CONTACTS ==========================================================
/**
 * This fuction runs the function to render the contacts.
 */
function initContacts() {
    renderLetters();
}

// ================================================ CONTACT LIST ==========================================================
/**
 * This function renders the letters for the categorization of the contacts to the contact list.
 */
function renderLetters() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        contactList.innerHTML += contactContainerTemplate(i, letter);
        renderContacts(i, letter);
        checkForEmptyLetters(i);
    }
}

/**
 * This function renders the contacts to the correct letter category of the contact list.
 * @param {string} i - index of the current letter
 * @param {string} letter  - current letter
 */
function renderContacts(i, letter) {
    let sortedContacts = document.getElementById('sortedContacts' + i);
    sortedContacts.innerHTML = '';
    contactsSorted = contacts.sort((a, b) => {if (a.name < b.name) {
            return -1;
        }
    });
    sortContacts(letter, sortedContacts);
}

/**
 * This function sorts the contacts depending on the starting letter.
 * @param {*} letter 
 */
function sortContacts(letter, sortedContacts) {
    for (let c = 0; c < contactsSorted.length; c++) {
        let contactListName = contacts[c]['first_name'];
        let contactListSurname = contacts[c]['last_name'];
        let contactEmail = contacts[c]['email'];
        let contactBgColor = contacts[c]['color'];
        randomBackground();
        //nameGetFirstLetter(c);
        getFirstletter(c);
        if(firstLetters.charAt(0).toUpperCase() == letter) {
            sortedContacts.innerHTML += sortedContactsTemplate(c, contactBgColor, firstLetters, contactListName, contactListSurname, contactEmail);
        }
    }
}

/**
 * This function checks if letter cegory is empty end hindes it. 
 * @param {index} i - index of the letter
 */
function checkForEmptyLetters(i) {
    let contactContainer = document.getElementById('contactContainer' + i);
    let emptyLetters = document.getElementById('sortedContacts' + i);
    if (emptyLetters.innerHTML == '') {
        contactContainer.style.display = 'none';
    }
}

/**
 * This function returns the first letter form the name and surname of the contact.
 * @param {index} c - index of the current contact of the "contactsSorted" array.
 */
/* function nameGetFirstLetter(i) {
    let x = contacts[i]['name'];
    x = x.split(' ').map(word => word.charAt(0)).join('');
    let y = contacts[i]['surname'];
    y = y.split(' ').map(word => word.charAt(0)).join('');
    firstLetters = x.toUpperCase() + y.toUpperCase();
} */

// ================================================ ADD NEW CONTACT ==========================================================
/**
 * This function displays the add contacts overlay.
 */
function newContact() {
    document.getElementById('addContactBackground').style.display = 'flex';
}

/**
 * This function closes the add contacts overlay and resets the input values.
 */
function closePopup() {
    document.getElementById('addContactBackground').style.display = 'none';
    document.getElementById('editContactBackground').style.display = 'none';
    document.getElementById('contactName').value = '';
    document.getElementById('contactSurname').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

/**
 * This function prevents the a function from a parent element is beeing executed when clicked on a child element.
 * @param {*} event 
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * This function runs the formvalidation and saves the new contact to the "contacts" array on the ftp server.
 */
async function createContact() {
    randomBackground();
    checkForPhoneNumber();
    generateContactId();
    let newContact = {name: document.getElementById('contactName').value, surname: document.getElementById('contactSurname').value, email: document.getElementById('contactEmail').value, phone: contactPhoneValue, contactColor: bgColor, contactId: idContact};
    contacts.push(newContact);
    await saveContacts();
    document.getElementById('contactName').value = '';
    document.getElementById('contactSurname').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    renderLetters();
    displaySnackbar('contactCreated');
    document.getElementById('addContactBackground').style.display = 'none';
}

/**
 * This function generates a random color.
 */
function randomBackground() {
    let x = Math.floor(Math.random() * 256)
    let y = Math.floor(Math.random() * 256)
    let z = Math.floor(Math.random() * 256)
    bgColor = `rgb(${x}, ${y}, ${z})`;
}

/**
 * This function generates a contact id.
 */
function generateContactId() {
    idContact = Math.floor((Math.random() * 1000000) + 1);
    for (let i = 0; i < contacts.length; i++) {
        if(contacts[i]['contactId'].includes === idContact) {
            generateContactId();
        }
    }
}

/**
 * This function saves the contact data on the ftp server.
 */
async function saveContacts() {
    let contactsAsString = JSON.stringify(contacts);
    await backend.setItem('contacts', contactsAsString);
}

// ================================================ OPEN CONTACTS ==========================================================
/**
 * This function displays all the contact info.
 * @param {index} c - index of the current contact
 */
function openContactInfo(c) {
    activeContact(c);
    let contactInformation = document.getElementById('contactsContent');
    contactInformation.innerHTML = '';
    let contactInfoName = contacts[c]['first_name'];
    let contactInfoSurname = contacts[c]['last_name'];
    let contactInfoEmail = contacts[c]['email'];
    let contactInfoPhone = contacts[c]['phone'];
    let contactInfoBgColor = contacts[c]['color'];
    //nameGetFirstLetter(c);
    getFirstletter(c);
    contactInformation.innerHTML += contactInfoTemplate(firstLetters, contactInfoName, contactInfoSurname, c, contactInfoEmail, contactInfoPhone, contactInfoBgColor);
    document.getElementById('contactIconBig' + c).style.backgroundColor = contactInfoBgColor;
    document.getElementById('contactDetails' + c).style.animation = 'flying 225ms ease-in-out';
    checkWindowWidth();
}

/**
 * This function adds css classes depending on the width of the window.
 */
function checkWindowWidth() {
    if (window.innerWidth < 950) {
        document.getElementById('contactsBar').classList.add('d-none');
        document.getElementById('contactsContainer').classList.add('contactsContainerMobile');
        document.getElementById('newContactButton').classList.add('d-none');
    }
}

/**
 * This function highlights the acitve contact.
 * @param {index} c - index of the current contact
 */
function activeContact(c) {
    let currentElement = document.getElementById('contactID' + c);
    let allElements = document.querySelectorAll('.contact');
    allElements.forEach((element) => {
        element.style.backgroundColor = '#F6F7F8';
        element.style.color = 'black';
    })
    currentElement.style.backgroundColor = '#2A3647';
    currentElement.style.color = 'white';
}

/**
 * This function lets you go back to the contactlist.
 */
function backToContactsList() {
    document.getElementById('contactsBar').classList.remove('d-none');
    document.getElementById('contactsContainer').classList.remove('contactsContainerMobile');
    document.getElementById('newContactButton').classList.remove('d-none');
}

// ================================================ EDIT CONTACTS ==========================================================
/**
 * This function retrieves all the contact date of the current contact and displays them via the edit contacts overlay.
 * @param {index} i - index of the current contact
 */
function editContact(i) {
    renderSaveChangesForm(i);
    getCurrentContactData(i);
    let contactInfoBgColor = contacts[i]['contactColor'];
    //nameGetFirstLetter(i);
    getFirstletter(i);
    document.getElementById('contactImg').innerHTML = contactBigImgTemplate(i, firstLetters);
    document.getElementById('contactImgBg' + i).style.backgroundColor = contactInfoBgColor;
}

/**
 * This function retrievs the contact data.
 * @param {index} i - index of the current contact.
 */
function getCurrentContactData(i) {
    document.getElementById('editContactBackground').style.display = 'flex';
    document.getElementById('editContactName').value = contacts[i]['name'];
    document.getElementById('editContactSurname').value = contacts[i]['surname'];
    document.getElementById('editContactEmail').value = contacts[i]['email'];
    document.getElementById('editContactPhone').value = contacts[i]['phone'];
}

function renderSaveChangesForm(i) {
    let saveChangesFormContainer = document.getElementById('saveChangesFormContainer');
    saveChangesFormContainer.innerHTML = "";
    saveChangesFormContainer.innerHTML += saveChangesFormTemplate(i);
}

/**
 * This function saves the changed contact data.
 * @param {index} i - index of the current contact
 */
async function saveChanges(i) {
    contacts[i]['name'] = document.getElementById('editContactName').value;
    contacts[i]['surname'] = document.getElementById('editContactSurname').value;
    contacts[i]['email'] = document.getElementById('editContactEmail').value;
    contacts[i]['phone'] = document.getElementById('editContactPhone').value;
    checkForPhoneNumberEdit(i);
    await saveContacts();
    renderLetters();
    displaySnackbar('contactChangesSaved');
    document.getElementById('editContactBackground').style.display = 'none';
    openContactInfo(i);
}

/**
 * This function checks if the phone number contains a value and adds a "-" if empty.
 * @param {index} i - index of the current contact 
 */
function checkForPhoneNumber() {
    if(document.getElementById('contactPhone').value == "") {
        contactPhoneValue = '-';
    } else {
        contactPhoneValue = document.getElementById('contactPhone').value;
    }
}

/**
 * This function checks if the phone number contains a value and adds a "-" if empty.
 * @param {index} i - index of the current contact 
 */
function checkForPhoneNumberEdit(i) {
    let editContactPhoneInput = document.getElementById('editContactPhone');
    if(editContactPhoneInput.value == "") {
        contacts[i]['phone'] = '-';
    } else {
        contacts[i]['phone'] = editContactPhoneInput.value;
    }
}

/**
 * This function deletes the contact.
 * @param {index} i - index of the current contact
 */
function deleteContact(i) {
    contacts.splice(i, 1);
    saveContacts();
    document.getElementById('contactsContent').innerHTML = '';
    renderLetters();
}


