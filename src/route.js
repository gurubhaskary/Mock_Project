//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const TeacherController = require("./controller/TeacherController")
const StudentController = require("./controller/StudentController");
const {authentication,authorisation} = require("./middleware/auth")

//=========Teacher Routes===============
router.post("/register", TeacherController.createTeacher);
router.post("/login", TeacherController.login);

//============Student Routes=============
router.post("/createStudent",authentication,StudentController.createStudent);
router.get("/GetStudent/:name/:subject",authentication, StudentController.viewStudent);
router.put("/EditStudent/:name/:subject",authentication,authorisation,StudentController.updateStudent);
router.delete("/DeleteStudent/:name/:subject",authentication,authorisation,StudentController.deleteStudent);


//=====================Module Export=====================//
module.exports = router;   