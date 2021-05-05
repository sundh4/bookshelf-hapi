const {
  addNewBookHandler,
  getAllBooksHandler,
  getBookByIDHandler,
  editBookByIDHandler,
  deleteBookByIDdHandler,
} = require('../controllers/handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return '<h1>Welcome to Book Shelf REST API</h1>';
    },
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'POST',
    path: '/books',
    handler: addNewBookHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookid}',
    handler: getBookByIDHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookid}',
    handler: editBookByIDHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookid}',
    handler: deleteBookByIDdHandler,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      const response = h.response({
        status: 'error',
        message: 'Endpoint tidak ditemukan.',
      });
      response.code(500);
      return response;
    },
  },
];
module.exports = routes;
