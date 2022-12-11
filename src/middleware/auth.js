const jwt = require("jsonwebtoken")
const studentModel = require("../model/studentModel")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "login is required" })
        let decodedtoken = jwt.verify(token, "this is a private key")
        if (!decodedtoken) return res.status(401).send({ status: false, msg: "token is invalid" })
        req.loggedInTeacher=decodedtoken.TeacherId
        next()
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}


const authorisation = async function (req, res, next) {
    try {

        let name = req.params.name;
        let subject = req.params.subject
        if(!name && !subject){
            return res.status(400).send({status:false,msg:"Kindly provide name and subject in path"});
        }

            let teacherDetails = await studentModel.findOne({ name:name,subject:subject })
            if(!teacherDetails) return res.status(400).send({status:false, msg:"No Data with this input given in params"})
            let teacherId = teacherDetails.teacherId

            let id = req.loggedInTeacher
            if (id != teacherId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })

        next();
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}



module.exports = { authentication , authorisation }