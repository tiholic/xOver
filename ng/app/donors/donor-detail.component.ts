/**
 * Created by rohit on 16/9/16.
 */

import {Component, ViewChild, AfterViewInit} from "@angular/core";
import {Router} from "@angular/router";
import {DonorService} from "./donor.service";
import {Donor} from "../objects";
import {MapComponent} from "../maps/map.component";
@Component({
    selector: 'donor-detail',
    templateUrl: 'ng/app/donors/donor-detail.component.html',
    styleUrls: ['ng/app/donors/donor.component.css'],
    providers: [DonorService]
})
export class DonorDetailComponent implements AfterViewInit{
    donor:Donor = {
        name:{
            first: '',
            last: ''
        },
        _id: '',
        contact_number: '',
        email: '',
        blood_group: '',
        coordinates:{
            latitude: 100,
            longitude: 200
        }
    };
    donorPrivate:string;
    errors:string[] = [];
    mapInitialised:boolean=false;
    deleted:boolean = false;
    updated:boolean = false;
    host:string = window.location.host;
    @ViewChild('map') mapComponent:MapComponent;

    constructor(
        private donorService:DonorService,
        private router: Router
    ){ }

    ngAfterViewInit(){
        var params = window.location.search.substring(1).split('&');
        var donor_id = params[0].split('=')[1];
        this.donorPrivate = params[1].split('=')[1];
        this.donorService.getDonor(donor_id).subscribe(
            donor => {
                this.donor = donor;
                if(this.mapInitialised){
                    this.pointDonor();
                }
            },
            err => console.log(err)
        )
    }

    pointDonor():void{
        this.mapInitialised = true;
        this.mapComponent.addDonorToMap(this.donor);
        this.mapComponent.center(this.donor.coordinates);
    }

    updateDonor():void{
        if(this.validate()) {
            this.donorService.update(this.donor, this.donorPrivate).subscribe(
                donor => {
                    this.updated = true;
                    var s = this;
                    setTimeout(function(){
                        s.updated = false;
                    }, 5000);
                },
                err => console.log(err)
            )
        }
    }

    deleteDonor():void{
        this.donorService.del(this.donor._id).subscribe(
            status => {
                if(status.success){
                    this.deleted = true;
                }
            },
            err => console.log(err)
        )
    }


    setCoords(coordinates):void{
        this.donor.coordinates = coordinates;
    }

    validate():boolean{
        this.errors = [];
        var rawDonor:Donor = this.donor;
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
}