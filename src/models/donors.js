/**
 * Created by rohit on 14/9/16.
 */
var mongoose = require('mongoose');
var donorSchema = new mongoose.Schema({
    name: {
        first_name: String,
        last_name: String
    },
    contact_number: { type: String, required:true },
    email: { type: String, required: true },
    blood_group: { type: String, enum: [ 'a+', 'a-', 'b+', 'b-', 'o+', 'o-', 'ab+', 'ab-' ] }
});
var Donor = mongoose.model('Donors', donorSchema);
module.exports = Donor;