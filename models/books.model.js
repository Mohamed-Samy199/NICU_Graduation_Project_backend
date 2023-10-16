const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    phone : {
        type : String, 
        require : true
    },
    dateIssued : {  //data start
        type : String,
    },
    dateReturned : { //data leaved
        type : String,
    },
    price : {
        type : Number, 
    },
    url : {
        type : String
    },
    money : {
        type : Number
    }
});

const bookModel = mongoose.model("Book", bookSchema);

module.exports = bookModel;
