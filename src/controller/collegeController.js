const collegeModel = require('../model/collegeModel'); //import authorModel


const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const createCollege = async(req, res) => {
    try {
        let data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST,Please provide college details " });
        }
        if (!isValid(data.name)) {
            return res.status(400).send({ status: false, msg: "Name is Required" });

        }
        const nameAlreadyUsed = await collegeModel.findOne({ name: data.name });
        if (nameAlreadyUsed) {
            res.status(400).send({ status: false, message: `${data.name}  college Name is already registered` })
            return
        }
        if (!isValid(data.fullName)) {
            return res.status(400).send({ status: false, msg: "FullName is Required" });
        }
        if (!isValid(data.logoLink)) {
            return res.status(400).send({ status: false, msg: "logoLink is Required" });
        }

        let savedCollege = await collegeModel.create(data)
        return res.status(201).send({ status: true, msg: savedCollege });
    } catch (error) {
        console.log("This is the error:", error.message);
        res.status(500).send({ status: false, msg: error.message });
    }
}
module.exports.createCollege = createCollege