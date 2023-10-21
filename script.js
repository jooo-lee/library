// Store current user's books
const userLibrary = [];

// Book object constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Push Book instance to userLibrary array
function addBookToLibrary(book) {
    userLibrary.push(book);
}

// --------------------------------- Displaying book cards on page ---------------------------------

// Loop through userLibrary array and display each book as a card
// Cards are displayed in reverse order of userLibrary array
function displayBooks() {
    const cardContainer = document.querySelector("#card-container");
    userLibrary.forEach((book) => {
        const card = createCard(book);
        cardContainer.prepend(card);
    });
}

// Create HTML DOM element for Book instance
function createCard(book) {
    const card = document.createElement("div");
    card.classList.add("card");

    // Loop over Book instance properties and create DOM element for each property
    Object.keys(book).forEach(key => {
        switch(key) {
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

    // Create and add delete book button
    const deleteBtn = createDeleteBtn();
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
    return btn;
}

function createDeleteBtn() {
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.classList.add("delete");
    return btn;
}

// ------------------------------- Opening and closing new book modal -------------------------------

// Button for opening add book modal
const addBookBtn = document.querySelector("#add-book");
// Add book to library modal
const addBookModal = document.querySelector("#add-book-modal");
// Button for cancelling add new book
const cancelAddBookBtn = document.querySelector("#add-book-modal .cancel-modal");

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
addBookModal.addEventListener("click", e => {
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

// ------------------------------- New book modal form validation -------------------------------

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

// ------------------------------- Adding and displaying new book -------------------------------

// Add new book modal form
const addBookForm = document.querySelector("#add-book-form");
addBookForm.addEventListener("submit", addNewBook);

function addNewBook(e) {
    // Prevent default form submission behaviour
    e.preventDefault();

    // Get user inputted values from form
    const newBookTitle = addBookForm.elements["title"].value;
    const newBookAuthor = addBookForm.elements["author"].value;
    const newBookPages = addBookForm.elements["pages"].value;
    const newBookRead = addBookForm.elements["read"].checked;

    const newBook = new Book(newBookTitle, newBookAuthor, newBookPages, newBookRead);
    addBookToLibrary(newBook);

    closeAddBookModal();

    displayNewBook(newBook);
}

function displayNewBook(newBook) {
    const cardContainer = document.querySelector("#card-container");
    const card = createCard(newBook);
    cardContainer.prepend(card);
}

// ------------------------------- Display default books for testing  -------------------------------

const bk1 = new Book("Finding Me", "Viola Davis", 304, true);
const bk2 = new Book("In.", "Will McPhail", 267, true);
const bk3 = new Book("The Wind-Up Bird Chronicle", "Haruki Murakami", 607, false);
const bk4 = new Book("Oscar et la dame rose", "Éric-Emmanuel Schmitt", 83, false);
addBookToLibrary(bk1);
addBookToLibrary(bk2);
addBookToLibrary(bk3);
addBookToLibrary(bk4);
displayBooks();