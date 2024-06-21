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
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

// function untuk cek storage pada browser
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung penyimpanan");
    return false;
  }
  return true;
}

// event listener untuk dijalankan setelah webiste selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    submitForm.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
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
  saveData();
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
  const completedBookList = document.getElementById("completed");

  const unfinishedBook = document.getElementById("jumlahBukuBelumSelesai");
  const finishedBook = document.getElementById("jumlahBukuSudahSelesai");
  const unReadBook = bookshelves.filter(
    (book) => book.status === "unfinished"
  ).length;
  const readBook = bookshelves.filter(
    (book) => book.status === "finished"
  ).length;

  while (uncompletedBookList.rows.length > 1) {
    uncompletedBookList.deleteRow(1);
  }

  while (completedBookList.rows.length > 1) {
    completedBookList.deleteRow(1);
  }

  unfinishedBook.innerHTML = `${unReadBook} buku`;
  finishedBook.innerHTML = `${readBook} buku`;

  for (const bookItem of bookshelves) {
    const bookElement = makeBook(bookItem);
    if (bookItem.status == "unfinished") {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

// method untuk menambahkan buku
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
  tdButton.innerText = "Hapus";
  tdTahun.innerText = bookObject.year;

  trData.append(tdJudul, tdPenulis, tdStatus, tdButton, tdTahun);

  if (bookObject.status == "finished") {
    tdStatus.addEventListener("change", function () {
      undoBookFromCompleted(bookObject.id);
    });

    tdButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });
  } else {
    tdStatus.addEventListener("change", function () {
      addBookToCompleted(bookObject.id);
    });

    tdButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });
  }

  return trData;
}

// method untuk menambahkan buku ke rak completed
function addBookToCompleted(bookId) {
  const book = findBook(bookId);

  if (book == null) return;

  book.status = "finished";
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function untuk mencari book id
function findBook(bookId) {
  for (const bookItem of bookshelves) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// function untuk mencari index book
function findBookIndex(bookId) {
  for (const index in bookshelves) {
    if (bookshelves[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

// function untuk menghapus book dari rak
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  bookshelves.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function untuk mengembalikan book ke rak not-completed
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.status = "unfinished";
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function untuk menyimpan data ke local storage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelves);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// function untuk menampilkan data yang disimpan pada local storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      bookshelves.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
