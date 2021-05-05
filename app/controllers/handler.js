// Import modules
const {nanoid} = require('nanoid');
const books = require('../models/books');

// Function to add new book
const addNewBookHandler = (request, h) => {
  // Define payload
  const {
    name, // string
    year, // number
    author, // string
    summary, // string
    publisher, // string
    pageCount, // number
    readPage, // number
    reading, // boolean
  } = request.payload;

  // Payload Validation
  // Check if request payload name is exists or not empty or correct string
  if (!request.payload.name ||
    !!request.payload.name && typeof request.payload.name !== 'string' ||
    !request.payload.name.trim() ||
    request.payload.name === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.header('content-type', 'application/json');
    response.code(400);
    return response;
  };

  // Check if readPage not more than pageCount
  if (request.payload.readPage > request.payload.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.header('content-type', 'application/json');
    response.code(400);
    return response;
  };

  // Define other property calculated from server
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

  // Assign new object from all const defined.
  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Update array models
  books.push(newBooks);

  /*
  Get isSuccess status.
  if true = insert success
  if false = insert failed.
  */
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    // set response using hapi toolkit
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.header('content-type', 'application/json');
    response.code(201);
    return response;
  }

  // Failed block code
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.header('content-type', 'application/json');
  response.code(500);
  return response;
};

/* else if (request.query.reading) {
    const book = books.filter((n) => n.reading === reading)[0];
  } else if (request.query.finished) {
    const book = books.filter((n) => n.finished === finished)[0];
  }
*/

// Function to get all books
const getAllBooksHandler = (request, h) => {
  // Define query
  const {name, reading, finished} = request.query;
  // Init variable array to append new object
  const listBook = [];

  // Condition if query name exists
  if (request.query.name) {
    books.forEach((book) => {
      // Need to remove single quote or double quote before comparing.
      if (book.name.toUpperCase().includes(name.toUpperCase().replace(/^["'](.+(?=["']$))["']$/, '$1'))) {
        // Update array models
        listBook.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      }
    });
  } else if (request.query.reading !== undefined && reading === '0') { // Condition if query reading exists
    // const reading = false;
    books.forEach((book) => {
      // Need to remove single quote or double quote before comparing.
      if (book.reading === false) {
        // Update array models
        listBook.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      };
    });
  } else if (request.query.reading !== undefined && reading === '1') {
    // const reading = false;
    books.forEach((book) => {
      // Need to remove single quote or double quote before comparing.
      if (book.reading === true) {
        // Update array models
        listBook.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      };
    });
  } else if (request.query.finished !== undefined && finished === '0') {
    // const reading = false;
    books.forEach((book) => {
      // Need to remove single quote or double quote before comparing.
      if (book.finished === false) {
        // Update array models
        listBook.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      };
    });
  } else if (request.query.finished !== undefined && finished === '1') {
    // const reading = false;
    books.forEach((book) => {
      // Need to remove single quote or double quote before comparing.
      if (book.finished === true) {
        // Update array models
        listBook.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      };
    });
  } else {
    // Assign all books into new list book array object to be shown.
    books.forEach((book) => {
      // Update array models
      listBook.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    });
  };
  // Assign response
  const response = h.response({
    status: 'success',
    data: {
      books: listBook,
    },
  });
  // change header and response code
  response.header('content-type', 'application/json');
  response.code(200);
  return response;
};


const getBookByIDHandler = (request, h) => {
  // Assign request param bookid
  const {bookid} = request.params;
  // Empty request param handler
  if (!request.params.bookid) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Find book data by id
  const book = books.filter((n) => n.id === bookid)[0];
  // succees if not undefined
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.header('content-type', 'application/json');
    response.code(200);
    return response;
  }
  // Else failed
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.header('content-type', 'application/json');
  response.code(404);
  return response;
};


// Function to edit book details based on ID
const editBookByIDHandler = (request, h) => {
  // Define request param
  const {bookid} = request.params;

  // Define payload
  const {
    name, // string
    year, // number
    author, // string
    summary, // string
    publisher, // string
    pageCount, // number
    readPage, // number
    reading, // boolean
  } = request.payload;

  // Payload Validation
  // Empty request param handler
  if (!request.params.bookid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };
  // Check if request payload name is exists or not empty or correct string
  if (!request.payload.name ||
    !!request.payload.name && typeof request.payload.name !== 'string' ||
    !request.payload.name.trim() ||
    request.payload.name === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.header('content-type', 'application/json');
    response.code(400);
    return response;
  };

  // Check if readPage not more than pageCount
  if (request.payload.readPage > request.payload.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.header('content-type', 'application/json');
    response.code(400);
    return response;
  };

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookid);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.header('content-type', 'application/json');
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.header('content-type', 'application/json');
  response.code(404);
  return response;
};


// Function to delete book by given id
const deleteBookByIDdHandler = (request, h) => {
  // Define request param
  const {bookid} = request.params;

  // Payload Validation
  // Empty request param handler
  if (!request.params.bookid) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.header('content-type', 'application/json');
    response.code(404);
    return response;
  };

  // Get index book
  const index = books.findIndex((book) => book.id === bookid);
  // Kalau index bernilai tidak sama dengan -1
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.header('content-type', 'application/json');
    response.code(200);
    return response;
  }

  // If book id not found
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.header('content-type', 'application/json');
  response.code(404);
  return response;
};

module.exports = {
  addNewBookHandler,
  getAllBooksHandler,
  getBookByIDHandler,
  editBookByIDHandler,
  deleteBookByIDdHandler,
};
