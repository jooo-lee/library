// Store current user's books
const userLibrary = [];

// Book object constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${read}`;
    }
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

    // TODO: Loop over Book instance properties and create respective HTML DOM elements
    // to replace what I have below using Object.keys() method or something similar

    const title = document.createTextNode(book.title);
    const author = document.createTextNode(book.author);
    const pages = document.createTextNode(book.pages);
    const read = document.createTextNode(book.read);
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(pages);
    card.appendChild(read);

    return card;
}


// For testing purposes
const bk1 = new Book("The Wind-Up Bird Chronicle", "Haruki Murakami", 607, false);
const bk2 = new Book("In.", "Will McPhail", 267, true);
const bk3 = new Book("Finding Me", "Viola Davis", 304, true);
addBookToLibrary(bk1);
addBookToLibrary(bk2);
addBookToLibrary(bk3);
displayBooks();