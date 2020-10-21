const axios = require("axios");
const { Books } = require("../models");
const db = require("../models");

// Export an object containing methods we'll use for accessing the google books API

module.exports = {
  getAllBooks: function(req, res) {
    const {query:params} = req
    axios.get("https://www.googleapis.com/books/v1/volume",{params},"key=AIzaSyAGbwxk6xJfsskC2cRm5NRiPHPiCa_WLtg")
    .then(res => {
        return res.data.items.filter(
            data => data.volumeInfo.title && 
                    data.volumeInfo.infoLink &&
                    data.volumeInfo.authors &&
                    data.volumeInfo.description &&
                    data.volumeInfo.imageLinks 
        )
    })
    .then(books => {
        return db.Books.find().then(dbBook => {
            return books.filter(
                book => dbBook.every(
                    dbData => dbData.id !== book.id
                )
            )
        })
    }).then(
        books => res.json(books)
    ).catch(err => res.json(err))
  },
};
