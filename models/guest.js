
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


var guestSchema = new Schema({
    name: {type: String, required: true},
    email: { type: String, required: true},
    phone: {type: Number,required: true},
    in_time: {type: Date,default: Date.now()},
    out_time:{type: Date},
    createdBy:{type:String, required:true}
}, {timestamps: true});

// Export Module/Schema
module.exports = mongoose.model('Guest', guestSchema);
