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
  // console.log(bookshelves);
  const uncompletedBookList = document.getElementById("not-completed");
  uncompletedBookList.innerHTML = "";

  // Memasukkan header hanya cukup sekali
  const trHead = document.createElement("tr");

  const thJudul = document.createElement("th");
  const thPenulis = document.createElement("th");
  const thStatus = document.createElement("th");
  const thTahun = document.createElement("th");

  thJudul.innerText = "Judul";
  thPenulis.innerText = "Penulis";
  thStatus.innerText = "Status";
  thTahun.innerText = "Tahun";

  thStatus.setAttribute("colspan", "2");
  trHead.append(thJudul, thPenulis, thStatus, thTahun);
  uncompletedBookList.append(trHead);

  for (const bookItem of bookshelves) {
    const bookElement = makeBook(bookItem);
    uncompletedBookList.append(bookElement);
  }
});

function makeBook(bookObject) {
  // data table
  const trData = document.createElement("tr");

  const tdJudul = document.createElement("td");
  const tdPenulis = document.createElement("td");
  const tdStatus = document.createElement("td");
  const tdButton = document.createElement("button");
  const tdTahun = document.createElement("td");

  // trData dikasih attribute id
  trData.setAttribute("id", `book-${bookObject.id}`);

  // tdButton
  tdButton.setAttribute("id", "deleteBook");
  tdButton.setAttribute("type", "button");

  // tdStatus >> statusSelect
  const statusSelect = document.createElement("select");
  statusSelect.setAttribute("name", "status");
  statusSelect.setAttribute("id", "status");

  // tdStatus >> statusSelect >> option
  const optionUnread = document.createElement("option");
  const optionRead = document.createElement("option");

  optionUnread.setAttribute("value", "unfinished");
  optionRead.setAttribute("value", "finished");

  optionUnread.innerText = "Sedang Dibaca";
  optionRead.innerText = "Selesai Dibaca";

  if (bookObject.status === "unfinished") {
    optionUnread.setAttribute("selected", "selected");
  } else {
    optionRead.setAttribute("selected", "selected");
  }

  // tdStatus
  statusSelect.append(optionUnread, optionRead);
  tdStatus.append(statusSelect);

  tdJudul.innerText = bookObject.titleBook;
  tdPenulis.innerText = bookObject.author;
  // TODO:: ini statusSelect coba ganti jadi innerHTML kalo ga bisa
  tdButton.innerText = "Hapus";
  tdTahun.innerText = bookObject.year;

  trData.append(tdJudul, tdPenulis, tdStatus, tdButton, tdTahun);

  // <table id="not-completed">
  // trData di append ke table
  // tableNotCompleted.append(trData);

  return trData;
}
