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
    coordinates: Coords;
}

export class RawDonor{
    name: {
        first: string,
        last: string
    };
    contact_number: string;
    email: string;
    blood_group: string;
    coordinates: Coords;
}

export class PrivateDonor{
    _id: string;
    name: {
        first: string,
        last: string
    };
    private_id:string;
    contact_number: string;
    email: string;
    blood_group: string;
    coordinates: Coords;
}

export class Coords{
    latitude:number;
    longitude:number;
}

export class Bounds{
    min: Coords;
    max: Coords
}