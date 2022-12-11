const mongoose=require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const studentSchema= new mongoose.Schema({
    name: {
        type: String, 
        required :true, 
        trim:true
    },
    subject: {
        type: String, 
        required :true,
        trim:true,
        enum : ["English","Hindi", "Maths","Science","Social"]
    },
    marks: {
        type: Number, 
        trim:true
    },
    teacherId: {
        type: ObjectId,
         ref: "TeacherCollection",
          required :true
         }
},{timeStamps: true})

module.exports= mongoose.model("StudentCollection",studentSchema)