const jwt = require("jsonwebtoken")
const TeacherModel = require("../model/teacherModel")
const { valid, regForName, regForEmail, regForPassword, isValidRequestBody } = require("../validator/validate")



//============Teacher Register=================
const createTeacher = async function (req, res) {
    try {
        const data = req.body
        const {name, email, password } = data

        //===================== Checking the input value is Valid or Invalid =====================//
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body is empty, please provied data" });
        }

        //=====================Validation of Name=====================//

        if (!name) return res.status(400).send({ status: false, message: "Name is required" })
        if (!(valid(name))) return res.status(400).send({ status: false, msg: "Enter Valid Name" })
        if (!regForName(name)) return res.status(400).send({ status: false, msg: "Enter Valid Name in Alphabets" })

        //=====================Validation of Email=====================//
        if (!email) return res.status(400).send({ status: false, message: "Email is required" })
        if (!(valid(email))) return res.status(400).send({ status: false, msg: "Provide a valid Email" })
        if (!regForEmail(email)) return res.status(400).send({ status: false, msg: "Enter Valid Email with atleast 2 chars" })

        //=====================Checking the Duplication of Email=====================//
        let duplicateEmail = await TeacherModel.findOne({ email: email });
        if (duplicateEmail) return res.status(400).send({ status: false, message: "Email already exists!" });


        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, message: "Password is required" })
        if (!(valid(password))) return res.status(400).send({ status: false, msg: "Provide a valid Password" })
        if (!regForPassword(password)) return res.status(400).send({ status: false, msg: "Please Enter Password with atleast 8 chars and With atleast one UpperCase,LowerCase,Number and special characters" })

        //=====================Teacher Data Creation=====================//
        const newTeacher = await TeacherModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', newTeacher })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============Teacher Login=================
const login = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
        let data = req.body

        //=====================Checking the validation=====================//
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "Email and Password Required !" })

        //=====================Validation of EmailID=====================//
        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        if (!regForEmail(email)) return res.status(400).send({ status: false, msg: "Please Enter Valid Email ID" })

        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })
        if (!regForPassword(password)) return res.status(400).send({ status: false, msg: "Please Enter Password With atleast one UpperCase,LowerCase,Number and special characters" })

        //===================== Checking Teacher exsistance using Email and password=====================//
        const teacher = await TeacherModel.findOne({ email: email, password: password })
        if (!teacher) return res.status(401).send({ status: false, msg: "Email or Password Invalid Please try again !!" })

        //===================== Creating Token Using JWT =====================//
        const token = jwt.sign({
            TeacherId: teacher._id.toString(),
            batch: "plutonium",
        }, "this is a private key", { expiresIn: '1d' })

        res.status(200).send({ status: true, message: 'Success', data: token})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.createTeacher = createTeacher
module.exports.login = login
// module.exports= {createTeacher, login};