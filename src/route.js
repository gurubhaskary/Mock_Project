//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();


const UserController = require("../Controller/userController");
const bookController = require("../Controller/bookController")
// const {createUser,login} = require("../Controller/userController");
// const {createBooks,getAllBook,getBooksByPathParam, updateBookbyId,deletebyId} = require("../Controller/bookController");
const {bookValidation} = require("../Validator/validate")
const {authentication,authorisation} = require("../middleware/auth")
const reviewController = require("../Controller/reviewController")


router.post("/register", UserController.createUser);
router.post("/login", UserController.login);
router.post("/books", authentication,authorisation,bookController.createBooks);
router.get("/books", bookController.getAllBook);
router.get("/books/:bookId", bookController.getBooksByPathParam);
router.put("/books/:bookId",bookController.updateBookbyId);
router.delete("/books/:bookId",authentication,authorisation, bookController.deletebyId);
router.post("/books/:bookId/review", reviewController.createReview);
router.put("/books/:bookId/review/:reviewId", reviewController.updateReviewByBookId);
router.delete("/books/:bookId/review/:reviewId", reviewController.deletebyreviewId);

router.post("/books/aws/:bookId", bookController.awsLink);

router.post("/aws/bookId", function(req,res){
    
        let files= req.files
        let {category} =JSON.parse(req.body)
        console.log(category)
        console.log(typeof(category))
        console.log(files)
        res.send({data:files})
});






//=====================Module Export=====================//
module.exports = router;   