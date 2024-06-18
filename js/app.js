/**
 * [
 *    {
 *      id: <int>
 *      judul: <string>
 *      penulis: <string>
 *      status: <boolean>
 *      tahun: <int>
 *    }
 * ]
 */

// array bookshelves
const bookshelves = [];

// custom event
const RENDER_EVENT = "render-book";

// event listener untuk dijalankan setelah webiste selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

// method untuk menambahkan buku ke table not-completed / completed
function addBook() {
  const titleBook = document.getElementById("titleBook").value;
  const author = document.getElementById("authorBook").value;
  const year = document.getElementById("yearBook").value;
  const status = document.getElementById("statusBook").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    titleBook,
    author,
    status,
    year
  );

  bookshelves.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// method untuk mengembalikan timestamp untuk digunakan sebagai id
function generateId() {
  return +new Date();
}

// method untuk mengembalikan nilai dari input ke bentuk object
function generateBookObject(id, titleBook, author, status, year) {
  return {
    id,
    titleBook,
    author,
    status,
    year,
  };
}

// mengecek listener dari RENDER_EVENT untuk melihat data berhasil diinput ke bookshelves atau tidak.
document.addEventListener(RENDER_EVENT, function () {
  console.log(bookshelves);
});
