// Book storage model
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
};

//Class for local storage handling
class Store {
    static getBook() {
        let books;
        if (localStorage.getItem('books') === null) { //check for preexisting bppks in stotage
            books = []; //make it an array
        } else { //if it conrains books
            books = JSON.parse(localStorage.getItem('books')) //convert local storage items to string
        }
        return books
    }

    static addBook(Book) {
        const books = Store.getBook();
        books.push(Book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    
    static removeBook() {
        const books = Store.getBook();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        })
    }
    
} 

// Class to wrap all books activities(method)
class UI {
    static displayBooks() { // static keyword prevents instantiation of the method called 
        // create an array to store books
        const StoredBooks = Store.getBook();
        //loop throug the array of stored books and define a function to add each
        const books = StoredBooks;
        //Loop function
        books.forEach((book) => UI.addBookToList(book));
    }
    // creating the addbooktolist method to output books to the table rows in the html file
    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        // create element type row to add the looped books
        const row = document.createElement('tr');
        // create datas that will be inserted into the row //backstick function was used to support text literals
        row.innerHTML = `  
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `;
        // Now we append the datas to the row
        list.appendChild(row);

    }

    // Alert class method
    static showAlert(message, className) {
        const div = document.createElement('div'); //creates new div node
        div.className = `alert alert-${className}`; // create a class
        div.appendChild(document.createTextNode(message)); //add to class
        const container = document.querySelector('.container'); //select the container class
        const form = document.querySelector('#book-form'); //select the form
        //then insert into the DOM
        container.insertBefore(div, form);

        // lets make displayed error disappear from the UI after few seconds
        setTimeout(() => document.querySelector('.alert').remove(), 5000);
    }

    // deleting  books from the UI function
    static deleteBook(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    //create another function to clear the inputed list on the UI
    static claerFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }


}
//Use an Event to add the created function and row datas
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Adding a new book to list
document.querySelector('#book-form').addEventListener('submit',
    (e) => {
        //lets prevent the default submit button behavior
        e.preventDefault();
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        // Validationg the form fiels
        if (title === '' || author === '' || isbn === '') {
            UI.showAlert('Please fill in all fields', 'danger') //to show alert when form is not properly filled
        } else {
            //lets instantiate from the book class above
            const book = new Book(title, author, isbn);

            //adding the newly created book to the UI and display
            UI.addBookToList(book);

            Store.addBook(book);

            //Validation when books are successfully validated
            UI.showAlert('Book Successfully Added', 'success'); //"success is a classs of bootstrap with style of green and block"

            //clear the inputs
            UI.claerFields(book);
        }
    });

// deleting a book from the UI
document.querySelector('#book-list').addEventListener('click',
    (e) => {
        //remove book from UI
        UI.deleteBook(e.target);
        //remove book from localstorage using the isbn
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

        //book remover validation
        UI.showAlert('Book Removed', 'success');
    });