// Store current user's books
const userLibrary = [];

// Book object constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Add Book instance to start of userLibrary array
function addBookToLibrary(book) {
    userLibrary.unshift(book);
}

// --------------------------------- Displaying book cards on page ---------------------------------

// Loop through userLibrary array and display each book as a card
function displayBooks() {
    const cardContainer = document.querySelector("#card-container");
    userLibrary.forEach((book) => {
        const card = createCard(book);
        cardContainer.appendChild(card);
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

// ------------------------------- Adding a new book to the library -------------------------------

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
    addBookModal.close()
    // Allow scrolling when modal is closed
    document.body.style.overflow = "auto";
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