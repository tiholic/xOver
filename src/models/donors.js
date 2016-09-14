/**
 * Created by rohit on 14/9/16.
 */
var mongoose = require('mongoose');
var donorSchema = new mongoose.Schema({
    name: {
        first: { type:String, required: true },
        last: String
    },
    contact_number: { type: String, required:true, unique: true },
    email: { type: String, required: true, unique: true },
    blood_group: { type: String, enum: [ 'A+', 'a+', 'A-', 'a-', 'B+', 'b+', 'B-', 'b-', 'O+', 'o+', 'O-', 'o-', 'AB+', 'ab+', 'AB-', 'ab-' ] },
    ip_address: { type:String, required:true },
    coordinates: {
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true}
    }
},{strict: true});
var Donor = mongoose.model('Donors', donorSchema);
module.exports = Donor;