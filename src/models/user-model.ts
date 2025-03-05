import mongoose from "mongoose";

// User Schema
const UserSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        default : "",
    },
    profilePic : {
        type : String,
        default : ""
    },
    Bio : {
        type : String,
        default : ""
    },
    phone : {
        type : String,
        default : ""
    },
    address : {
        type : String,
        default : ""
    },
    mfa : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true,
});

// Export the User Model
export const User = mongoose.model('User', UserSchema);