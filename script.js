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

// Loop through userLibrary array and display each book on page
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
        if (key == "read") {
            const btn = document.createElement("button");
            btn.textContent = book[key] ? "Read" : "Unread";
            if (!book[key]) btn.classList.toggle("unread");
            card.appendChild(btn);
            // Continue to next iteration of forEach loop
            return;
        }

        const keyPara = document.createElement("p");
        // We must use bracket notation here in book[key] rather than dot notation since
        // we are trying to dynamically access a property in book.
        const keyParaText = document.createTextNode(`${book[key]}`);
        if (key == "pages") {
            keyPara.prepend("Pages: ");
        }
        keyPara.appendChild(keyParaText);
        keyPara.classList.add(`${key}`);
        card.appendChild(keyPara);
    });

    return card;
}


// For testing purposes
const bk1 = new Book("Finding Me", "Viola Davis", 304, true);
const bk2 = new Book("In.", "Will McPhail", 267, true);
const bk3 = new Book("The Wind-Up Bird Chronicle", "Haruki Murakami", 607, false);
addBookToLibrary(bk1);
addBookToLibrary(bk2);
addBookToLibrary(bk3);
displayBooks();