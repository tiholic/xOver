/**
 * Created by rohit on 16/9/16.
 */

import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {DonorService} from "./donor.service";
import {Donor} from "../objects";
import {MapComponent} from "../maps/map.component";
@Component({
    selector: 'donor-detail',
    templateUrl: 'ng/app/donors/donor-detail.component.html',
    styleUrls: ['ng/app/donors/donor.component.css'],
    providers: [DonorService],
    directives:[MapComponent]
})
export class DonorDetailComponent implements OnInit{
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
    errors:string[] = [];

    constructor(
        private donorService:DonorService,
        private router: Router
    ){ }

    ngOnInit(){
        var params = window.location.search.substring(1).split('&');
        var pmap = {
            donor_id: null,
            donor_private: null
        };
        for(var i in params){
            var kv = params[i].split('=');
            pmap[kv[0]] = kv[1];
        }
        this.donorService.getDonor(pmap.donor_id).subscribe(
            donor => this.donor = donor,
            err => console.log(err)
        )
    }
}