/**
 * Created by rohit on 14/9/16.
 */

export class Donor{
    _id: string;
    name: {
        first: string,
        last: string
    };
    contact_number: string;
    email: string;
    blood_group: string;
    coordinates: {
        latitude:Number,
        longitude:Number
    }
}

export class RawDonor{
    name: {
        first: string,
        last: string
    };
    contact_number: string;
    email: string;
    blood_group: string;
    coordinates: {
        latitude:Number,
        longitude:Number
    }
}