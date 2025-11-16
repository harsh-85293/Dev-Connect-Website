const validator = require("validator")

const validatesignupdata = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("NAME IS NOT VALID");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not a valid email")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters and include: uppercase letter, lowercase letter, number, and symbol")
    }
}

const validateEditProfile = (req) => {
    const allowedEditfields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ] 

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditfields.includes(field))
    return isEditAllowed;
}

module.exports = {
    validatesignupdata,
    validateEditProfile
}