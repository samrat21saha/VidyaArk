const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 4,
        maxLength: 50,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address', ]
    },
    password: {
        type: String,
        required:[true, 'User Password is required'],
        minLength: 7,
    },
    address:{
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    favorites: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Book",
        },
    ],
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Book",
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Order",
        }
    ]
}, {timestamps: true});


module.exports = mongoose.model("User", userSchema);