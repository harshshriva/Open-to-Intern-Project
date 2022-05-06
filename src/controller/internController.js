const collegeModel = require('../model/collegeModel'); //import authorModel
const internModel = require('../model/internModel'); //import authorModel
const mongoose = require("mongoose");

let isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
let isValidObjectId = function(objectId) { return mongoose.Types.ObjectId.isValid(objectId) }

//======================= Create Intern Document====================//

const createInternDocument = async(req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST,Please provide intern details " });
        }
        let collegedata = await collegeModel.findOne({ name: data.collegeName })
        if (!collegedata) {
            return res.status(400).send({ status: false, message: "Please Provide valid CollegeName" });
        }
        data["collegeId"] = collegedata._id

        //collgeId
        let collegeId = data.collegeId
        if (!collegeId) {
            return res.status(400).send({ status: false, msg: "please Provide College Id" })
        }
        if (!isValid(data.collegeId)) {
            return res.status(400).send({ status: false, msg: "collegeId is required" });
        }
        if (!isValidObjectId(collegeId)) {
            return res.status(400).send({ status: false, msg: "invalid collegeId" });
        }
        //find college

        let college = await collegeModel.findById(data.collegeId);
        if (!college) {
            return res.status(400).send({ status: false, msg: "msg: Invalid college Id" });
        }

        //name valiation
        if (!isValid(data.name)) {
            return res.status(400).send({ status: false, msg: "Intern Name is required" });
        }

        //email validation
        if (!isValid(data.email)) {
            return res.status(400).send({ status: false, msg: "email is required" });
        }
        let email = data.email;
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, msg: "Please enter a valid email" })
        }
        const isEmailAlreadyUsed = await internModel.findOne({ email: data.email });
        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${data.email} email address is already registered` })
        }

        //mobile number validation
        if (!isValid(data.mobile)) {
            return res.status(400).send({ status: false, msg: "mobile is required" });
        }
        let mobile = data.mobile;
        if (!(/^(?!0+$)(\+\d{1,3}[- ]?)?(?!0+$)\d{10}$/.test(mobile))) {
            return res.status(400).send({ status: false, msg: "please provide valid mobile number" });
        }
        const MobileNumAlreadyUsed = await internModel.findOne({ mobile: data.mobile });
        if (MobileNumAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${data.mobile} mobile address is already registered` })
        }

        // save data
        let saveddata = await internModel.create(data);
        return res.status(201).send({ status: true, msg: "intern registered successfully ", data: saveddata });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};

//===============/Get College api/================//

const getCollegedatail = async(req, res) => {
    try {
        const collegeName = req.query.collegeName;
        if (!collegeName) {
            return res.status(400).send({ status: false, msg: "please Provide College Name" })
        }

        const findCollege = await collegeModel.findOne({ name: collegeName, isDeleted: false });
        if (!findCollege) {
            return res.status(404).send({ status: false, msg: "msg: college Not Found" });
        }

        const collegeId = findCollege._id

        const findIntern = await internModel.find({ collegeId: collegeId, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 })
        if (!findIntern) {
            return res.status(404).send({ status: false, msg: "no interest found for this college" })
        }
        const findCollegeData = {
            "name": findCollege.name,
            "fullName": findCollege.fullName,
            "logoLink": findCollege.logoLink,
            "interests": findIntern
        }
        return res.status(200).send({ status: true, data: findCollegeData });

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }

};

module.exports.createInternDocument = createInternDocument
module.exports.getCollegedatail = getCollegedatail