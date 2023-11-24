class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

// -------------------------------------- Initialize page --------------------------------------

// Store current user's books in array
const userLibrary = getCurrUserLibrary();

displayBooks();

// -------------------------------------- Local storage --------------------------------------

// Updating local storage after changes to userLibrary
function updateLocalStorage() {
    localStorage.setItem("userLibrary", JSON.stringify(userLibrary));
}

// Retrieve current user's userLibrary from local storage
function getCurrUserLibrary() {
    return JSON.parse(localStorage.getItem("userLibrary") || "[]");
}

// ----------------------------------- Library is empty message -----------------------------------

// If there are no books in the library, show the empty library message
function showEmptyMessage() {
    if (userLibrary.length == 0) {
        document.querySelector("#empty-library-message").style.display = "flex";
    }
}

// If there are books in the library, hide the empty library message
function hideEmptyMessage() {
    if (userLibrary.length != 0) {
        document.querySelector("#empty-library-message").style.display = "none";
    }
}

// --------------------------- Displaying book cards on page open or reload ---------------------------

// Loop through userLibrary array and display each book as a card
function displayBooks() {
    const cardContainer = document.querySelector("#card-container");

    hideEmptyMessage();

    for (let i = 0; i < userLibrary.length; i++) {
        const card = createCard(userLibrary[i]);
        // Link card with respective Book object
        card.setAttribute("data-index", i);
        cardContainer.appendChild(card);
    }
}

// Create HTML DOM element for Book instance
function createCard(book) {
    const card = document.createElement("div");
    card.classList.add("card");

    // Loop over Book instance properties and create DOM element for each property
    Object.keys(book).forEach((key) => {
        switch (key) {
            case "title":
            case "author":
            case "pages":
                // We must use bracket notation here in book[key] rather than dot notation since
                // we are trying to dynamically access a property in book.
                const paraNode = createCardParaNode(key, book[key]);
                card.appendChild(paraNode);
                break;
            case "read":
                const readBtn = createReadBtn(book[key]);
                card.appendChild(readBtn);
                break;
            default:
                break;
        }
    });

    const deleteBtn = createDeleteBtn();
    deleteBtn.addEventListener("click", deleteBook);
    card.appendChild(deleteBtn);

    return card;
}

function createCardParaNode(propertyName, propertyValue) {
    const para = document.createElement("p");
    const text = document.createTextNode(propertyValue);
    para.appendChild(text);
    para.classList.add(propertyName);
    if (propertyName == "pages") para.prepend("Pages: ");
    return para;
}

function createReadBtn(read) {
    const btn = document.createElement("button");
    btn.textContent = read ? "Read" : "Unread";
    if (!read) btn.classList.toggle("unread");
    btn.addEventListener("click", changeReadStatus);
    return btn;
}

function changeReadStatus() {
    this.classList.toggle("unread");

    // Change "read" status of corresponding Book instance in userLibrary
    const index = this.parentElement.getAttribute("data-index");
    userLibrary[index].read = !userLibrary[index].read;
    this.textContent = userLibrary[index].read ? "Read" : "Unread";

    updateLocalStorage();
}

function createDeleteBtn() {
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.classList.add("delete");
    return btn;
}

function deleteBook() {
    // Delete card DOM element
    this.parentElement.remove();

    // Delete Book instance from userLibrary
    const index = this.parentElement.getAttribute("data-index");
    userLibrary.splice(index, 1);

    updateLocalStorage();
    updateDataIndices();
    showEmptyMessage();
}

// Keep data-index attributes of cards consistent with respective Book object's index in userLibrary array
function updateDataIndices() {
    const cardContainer = document.querySelector("#card-container");

    for (let i = 0; i < cardContainer.children.length; i++) {
        const card = cardContainer.children[i];
        card.setAttribute("data-index", i);
    }
}

// ------------------------------- Opening and closing new book modal -------------------------------

// New book modal form
const addBookForm = document.querySelector("#add-book-form");
// Button for opening add book modal
const addBookBtn = document.querySelector("#add-book");
// Add book to library modal
const addBookModal = document.querySelector("#add-book-modal");
// Button for cancelling add new book
const cancelAddBookBtn = document.querySelector(
    "#add-book-modal .cancel-modal"
);

addBookBtn.addEventListener("click", openAddBookModal);
cancelAddBookBtn.addEventListener("click", closeAddBookModal);

function openAddBookModal() {
    addBookModal.showModal();
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
}

function closeAddBookModal() {
    addBookModal.close();
    // Allow scrolling when modal is closed
    document.body.style.overflow = "auto";
    // Clear form data
    addBookForm.reset();
}

// Close new book modal when clicking outside of it
addBookModal.addEventListener("click", (e) => {
    // Prevent checking and unchecking checkbox using keyboard from closing modal
    if (e.clientX == 0 && e.clientY == 0) return;
    const modalDimensions = addBookModal.getBoundingClientRect();
    if (
        e.clientX < modalDimensions.left ||
        e.clientX > modalDimensions.right ||
        e.clientY < modalDimensions.top ||
        e.clientY > modalDimensions.bottom
    ) {
        closeAddBookModal();
    }
});

// ----------------------------- Handle pages input for new book form  -----------------------------

const pagesInput = document.querySelector("#pages");
pagesInput.addEventListener("input", validatePages);
pagesInput.addEventListener("keydown", checkForDecimal);

// Make sure pages input is a positive integer
function validatePages() {
    // Prevent leading zeros
    if (pagesInput.value == "0") {
        pagesInput.value = pagesInput.value.replace(/0/, "");
        return;
    }
    pagesInput.value = pagesInput.value.replace(/[^\d]/, "");
}

// Prevent cursor from jumping to start of input if user presses decimal key
function checkForDecimal(e) {
    if (e.keyCode == 190) {
        e.preventDefault();
    }
}

// ---------------------------- Handle "enter" key for new book form ----------------------------

const textAndNumberInputs = document.querySelectorAll(
    "input[type='text'], input[type='number']"
);
textAndNumberInputs.forEach((input) =>
    input.addEventListener("keydown", submitOnEnter)
);

function submitOnEnter(e) {
    if (e.key == "Enter") {
        if (addBookForm.checkValidity()) {
            addNewBook(e);
        }
    }
}

// -------------------------------- Checking for duplicate books --------------------------------

const titleInput = document.querySelector("#title");
// Clear error message when user types so that form can be submitted
titleInput.addEventListener("input", clearCustomValidity);

function clearCustomValidity() {
    this.setCustomValidity("");
}

// Returns true if duplicate exists, false otherwise
function checkForDuplicates(currTitle) {
    for (const { title, ...others } of userLibrary) {
        if (title == currTitle) {
            return true;
        }
    }
    return false;
}

function displayDuplicateMsg() {
    titleInput.setCustomValidity("Book already exists!");
    titleInput.reportValidity();
}

// ------------------------------- Adding and displaying new book -------------------------------

addBookForm.addEventListener("submit", addNewBook);

function addNewBook(e) {
    // Prevent default form submission behaviour
    e.preventDefault();

    // Get user inputted values from form
    const newBookTitle = addBookForm.elements["title"].value;
    const newBookAuthor = addBookForm.elements["author"].value;
    const newBookPages = addBookForm.elements["pages"].value;
    const newBookRead = addBookForm.elements["read"].checked;

    // Check for duplicate books
    if (checkForDuplicates(newBookTitle)) {
        displayDuplicateMsg();
        return;
    }

    const newBook = new Book(
        newBookTitle,
        newBookAuthor,
        newBookPages,
        newBookRead
    );

    // Add Book instance to start of userLibrary array
    userLibrary.unshift(newBook);
    updateLocalStorage();

    closeAddBookModal();

    hideEmptyMessage();
    displayNewBook(newBook);
}

function displayNewBook(newBook) {
    const cardContainer = document.querySelector("#card-container");
    const card = createCard(newBook);
    cardContainer.prepend(card);
    updateDataIndices();
}
