const studentModel = require("../model/studentModel");
const { valid, regForName, isValidRequestBody } = require("../validator/validate")

const createStudent = async function (req, res) {
    try{
        let data = req.body;
        const {name, subject } = data;
        data.teacherId =req.loggedInTeacher;

        //===================== Checking the input value is Valid or Invalid =====================//
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body is empty, please provied data" });
        }

        //=====================Validation of Name=====================//

        if (!name) return res.status(400).send({ status: false, message: "Name is required" })
        if (!(valid(name))) return res.status(400).send({ status: false, msg: "Enter Valid Name" })
        if (!regForName(name)) return res.status(400).send({ status: false, msg: "Enter Valid Name in Alphabets and first letter in capital" })

        //=====================Validation of subject=====================//

        if (!subject) return res.status(400).send({ status: false, message: "subject is required" })
        if (!(valid(subject))) return res.status(400).send({ status: false, msg: "Enter Valid Name" })
        if (!["English","Hindi", "Maths","Science","Social"].includes(subject)) return res.status(400).send({ status: false, msg: `Enter anyone subject ["English","Hindi", "Maths","Science","Social"]` })

        //==========Incrementing Marks for existing Student==============//
        let existStudent =  await studentModel.findOne({name:data.name,subject:data.subject})
        if(existStudent){
        let updatedStudent = await studentModel.findByIdAndUpdate(existStudent._id,{$inc : {'marks' : +data.marks}} , { new: true })
        return res.status(200).send({ status: true, data: updatedStudent })
        }
        
        //=============Create New Student===================
        let newStudent = await studentModel.create(data)
        res.status(201).send({ status: true, msg: "success", data: newStudent })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const viewStudent = async function (req, res) {
    try{
        const {name, subject } = req.params
        let teacherId = req.loggedInTeacher

        //============Get Student Details=====================
        let allStudents = await studentModel.find({name,subject,teacherId})
        
        return res.status(200).send({ status: true, data: allStudents })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateStudent = async function (req, res) {
    try{
        const {name, subject } = req.params
        let teacherId = req.loggedInTeacher
        let data = req.body;

        //===================== Checking the input value is Valid or Invalid =====================//
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body is empty, please provied data to update" });
        }

        //=====================Validation of Name=====================//

        if(data.name){
        if (!(valid(data.name))) return res.status(400).send({ status: false, msg: "Enter Valid Name" })
        if (!regForName(data.name)) return res.status(400).send({ status: false, msg: "Enter Valid Name in Alphabets and first letter in capital" })
        }
        //=====================Validation of subject=====================//

        if(data.subject){
        if (!(valid(data.subject))) return res.status(400).send({ status: false, msg: "Enter Valid subject" })
        if (!["English","Hindi", "Maths","Science","Social"].includes(data.subject)) return res.status(400).send({ status: false, msg: `Enter anyone subject ["English","Hindi", "Maths","Science","Social"]` })
        }

        //=============Updating Student Details=================
        let updateStudent = await studentModel.findOneAndUpdate({name:name,subject:subject,teacherId:teacherId}, req.body, { new: true })
        if(!updateStudent) return res.status(400).send({status:false, msg:"No Data with this input"})
        return res.status(200).send({ status: true, data: updateStudent })
 
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const deleteStudent = async function (req, res) {
    try{
        const {name, subject } = req.params
        let teacherId = req.loggedInTeacher

        //=======Delete Student Details from Collection=============
        let deleteStudent = await studentModel.deleteMany({name:name,subject:subject,teacherId:teacherId},{ new: true })
        return res.status(200).send({ status: true, data: deleteStudent })
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports.createStudent = createStudent
module.exports.viewStudent = viewStudent
module.exports.updateStudent = updateStudent
module.exports.deleteStudent = deleteStudent