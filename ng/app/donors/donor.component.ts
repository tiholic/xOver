/**
 * Created by rohit on 14/9/16.
 */


import {Component, Output, EventEmitter, OnInit} from "@angular/core";
import {Donor, RawDonor, PrivateDonor} from "../objects";
import {DonorService} from "./donor.service";
import {Router} from "@angular/router";
import {MapComponent} from "../maps/map.component";
@Component({
    selector: 'donor',
    templateUrl: 'ng/app/donors/donor.component.html',
    styleUrls: ['ng/app/donors/donor.component.css'],
    directives:[MapComponent],
    providers: [DonorService]
})
export class DonorComponent implements OnInit{
    errorMessage:string;
    errors:string[] = [];
    success:any;
    component_name:string="donor";
    donor: PrivateDonor;
    rawDonor: RawDonor = {
        name:{
            first: '',
            last: ''
        },
        contact_number: '',
        email: '',
        blood_group: '',
        coordinates:{
            latitude: 100,
            longitude: 200
        }
    };
    host:string = window.location.host;
    @Output() helpText = new EventEmitter();

    constructor(
        private donorService:DonorService,
        private router: Router
    ){ }

    ngOnInit(){
        this.helpText.emit("Click on any point on map to fill your details and save to donors list");
    }

    addDonor():void{
        if(this.validate()) {
            this.donorService.create(JSON.stringify(this.rawDonor))
                .subscribe(
                    data => {
                        if (data.status.success) {
                            this.success = true;
                            this.donor = data.data;
                        } else {
                            this.success = false;
                            this.errors = Object.keys(data.status.detail.errors);
                        }
                    },
                    error => this.errorMessage = error
                );
        }
    }

    getDonor(id:string):void{
        this.donorService.getDonor(id)
            .subscribe(
                donor => this.donor = donor,
                error => this.errorMessage = error
            )
    }

    validate():boolean{
        this.errors = [];
        var rawDonor:RawDonor = this.rawDonor;
        var err:boolean = false;
        if(!rawDonor.name.first || (rawDonor.name.first!=undefined && rawDonor.name.first.trim() == "")){
            this.errors.push('name.first');
            err = true;
        }
        if(!(/^(00|\+)[0-9]{12}$/.test(rawDonor.contact_number))){
            this.errors.push('contact_number');
            err = true;
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(rawDonor.email))){
            this.errors.push('email');
            err = true;
        }
        if(!(/^(a|b|o|ab)(\+|\-)$/.test(rawDonor.blood_group.toLowerCase()))){
            this.errors.push('blood_group');
            err = true;
        }
        return !(err);
    }

    setCoords(coordinates):void{
        this.rawDonor.coordinates = coordinates;
    }

    closeForm():void{
        this.rawDonor.coordinates = {
            latitude: 100,
            longitude: 200
        }
    }
}