const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    userId:String,
    ambience:String,
    text:String,
    emotion:String,
    keywords:[String],
    summary:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Journal",journalSchema);