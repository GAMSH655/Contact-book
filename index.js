
const contactName = document.querySelector("#contactName");
const nameError = document.querySelector("#nameError");
const contactPhone = document.querySelector("#contactPhone");
const phoneError = document.querySelector("#phoneError");
const contactEmail = document.querySelector("#contactEmail");
const emailError = document.querySelector("#emailError");
const contactAddress = document.querySelector("#contactAddress");
const contactAddressError = document.querySelector("#contactAddressError");
const contactNotes = document.querySelector("#contactNotes");
const contactNotesError = document.querySelector("#contactNotesError");

const cancelEditBtn = document.querySelector("#cancelEditBtn");
const saveContactBtn = document.querySelector("#saveContactBtn");
const contactsList = document.querySelector("#contactsList");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const sidebarContacts = document.querySelector("#sidebarContacts");
const contactCount = document.querySelector("#contactCount");
const resultsCount = document.querySelector("#resultsCount");

const arrayofContacts = [];
let editingContactId = null;

// Clear form inputs
function clearInputs() {
    contactName.value = "";
    contactPhone.value = "";
    contactEmail.value = "";
    contactAddress.value = "";
    contactNotes.value = "";
}

// Clear validation messages
function clearWarning() {
    nameError.textContent = "";
    phoneError.textContent = "";
    emailError.textContent = "";
    contactAddressError.textContent = "";
    contactNotesError.textContent = "";
}

// Cancel editing
function cancelEdit() {
    editingContactId = null;
    saveContactBtn.textContent = "Save Contact";
    cancelEditBtn.hidden = true;
    clearInputs();
    clearWarning();
}

cancelEditBtn.addEventListener("click", function (e) {
    e.preventDefault();
    cancelEdit();
});

// Edit a contact
function editContact(contact) {
    contactName.value = contact.name;
    contactPhone.value = contact.number;
    contactEmail.value = contact.mail;
    contactAddress.value = contact.address;
    contactNotes.value = contact.notes;

    editingContactId = contact.contact_Id;

    saveContactBtn.textContent = "Update Contact";
    cancelEditBtn.hidden = false;
}

// Render all contacts
function renderContacts() {
    contactsList.innerHTML = "";

    if (arrayofContacts.length === 0 && emptyState) {
        emptyState.hidden = false;
    } else if (emptyState) {
        emptyState.hidden = true;
    }

    arrayofContacts.forEach(function (contact) {
        const contactCard = document.createElement("div");
        contactCard.classList.add("newlyCreatedContactDiv");

        const contactParagraph = document.createElement("p");
        contactParagraph.classList.add("contactParagraph");

        contactParagraph.textContent =
            `${contact.name}\n` +
            `${contact.number}\n` +
            `${contact.mail}\n` +
            `${contact.address}\n` +
            `${contact.notes}`;

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.type = "button";
        deleteBtn.setAttribute("aria-label", "Delete contact");

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash-alt");
        deleteBtn.appendChild(deleteIcon);

        deleteBtn.addEventListener("click", function () {
            const contactIndex = arrayofContacts.findIndex(function (item) {
                return item.contact_Id === contact.contact_Id;
            });

            if (contactIndex !== -1) {
                arrayofContacts.splice(contactIndex, 1);

                if (editingContactId === contact.contact_Id) {
                    cancelEdit();
                }

                renderContacts();
                searchContacts();
            }
        });

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.classList.add("editBtn");
        editBtn.type = "button";
        editBtn.setAttribute("aria-label", "Edit contact");

        const editIcon = document.createElement("i");
        editIcon.classList.add("fas", "fa-edit");
        editBtn.appendChild(editIcon);

        editBtn.addEventListener("click", function () {
            editContact(contact);
        });

        // Favorite button
        const favoriteBtn = document.createElement("button");
        favoriteBtn.classList.add("favoriteBtn");
        favoriteBtn.type = "button";
        favoriteBtn.setAttribute("aria-label", "Toggle favorite");

        const favoriteIcon = document.createElement("i");
        favoriteIcon.classList.add("fas", "fa-star");
        favoriteBtn.appendChild(favoriteIcon);

        favoriteBtn.classList.toggle("isFavorite", contact.isFavorite);

        favoriteBtn.addEventListener("click", function () {
            contact.isFavorite = !contact.isFavorite;
            renderContacts();
        });

        // Add elements to the card
        contactCard.append(
            contactParagraph,
            deleteBtn,
            editBtn,
            favoriteBtn
        );

        contactsList.appendChild(contactCard);
    });

    contactCount.textContent = arrayofContacts.length;
    resultsCount.textContent =
        `${arrayofContacts.length} contacts found`;
}

// Search contacts
function searchContacts() {
    const inputedContact = searchInput.value.trim().toLowerCase();

    sidebarContacts.innerHTML = "";

    const filteredContacts = arrayofContacts.filter(function (contact) {
        return (
            String(contact.contact_Id).includes(inputedContact) ||
            contact.name.toLowerCase().includes(inputedContact) ||
            contact.number.toLowerCase().includes(inputedContact) ||
            contact.mail.toLowerCase().includes(inputedContact)
        );
    });

    filteredContacts.forEach(function (contactItem) {
        const contactCard = document.createElement("div");
        contactCard.classList.add("contact-card");

        const sidebarContactName = document.createElement("p");
        sidebarContactName.classList.add("sidebarContactName");

        sidebarContactName.textContent =
            `${contactItem.name}\n` +
            `${contactItem.number}\n` +
            `${contactItem.mail}\n` +
            `${contactItem.address}\n` +
            `${contactItem.notes}`;

        contactCard.appendChild(sidebarContactName);
        sidebarContacts.appendChild(contactCard);
    });

    resultsCount.textContent =
        `${filteredContacts.length} contacts found`;
}

searchInput.addEventListener("input", searchContacts);

// Add or update a contact
saveContactBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearWarning();

    const inputedPhoneName = contactName.value.trim();
    const inputedPhoneNumber = contactPhone.value.trim();
    const inputedEmail = contactEmail.value.trim();
    const inputContactAdress = contactAddress.value.trim();
    const inputedContactNotes = contactNotes.value.trim();

    let isValid = true;

    if (inputedPhoneName === "") {
        nameError.textContent = "Enter a contact name";
        isValid = false;
    }

    if (inputedPhoneNumber === "") {
        phoneError.textContent = "Enter a phone number";
        isValid = false;
    }

    if (inputedEmail === "") {
        emailError.textContent = "Enter an email address";
        isValid = false;
    }

    if (inputContactAdress === "") {
        contactAddressError.textContent = "Enter a valid address";
        isValid = false;
    }

    if (inputedContactNotes === "") {
        contactNotesError.textContent = "Add a note";
        isValid = false;
    }

    if (!isValid) return;

    if (editingContactId !== null) {
        const contactToUpdate = arrayofContacts.find(function (contact) {
            return contact.contact_Id === editingContactId;
        });

        if (!contactToUpdate) return;

        contactToUpdate.name = inputedPhoneName;
        contactToUpdate.number = inputedPhoneNumber;
        contactToUpdate.mail = inputedEmail;
        contactToUpdate.address = inputContactAdress;
        contactToUpdate.notes = inputedContactNotes;

        editingContactId = null;
        saveContactBtn.textContent = "Save Contact";
        cancelEditBtn.hidden = true;
    } else {
        const newContact = {
            contact_Id: Date.now(),
            name: inputedPhoneName,
            number: inputedPhoneNumber,
            mail: inputedEmail,
            address: inputContactAdress,
            notes: inputedContactNotes,
            isFavorite: false
        };

        arrayofContacts.push(newContact);
    }

    renderContacts();
    searchContacts();
    clearInputs();
    clearWarning();
});

// Initial display
renderContacts();
searchContacts();
