/**
 * Created by rohit on 16/9/16.
 */

import {Component, OnInit} from "@angular/core";
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    NavigationExtras, Router
} from "@angular/router";
import {DonorService} from "./donor.service";
import {PrivateDonor} from "../objects";
import {MapComponent} from "../maps/map.component";
@Component({
    selector: 'donor-detail',
    templateUrl: 'ng/app/donors/donor-detail.component.html',
    styleUrls: ['ng/app/donors/donor.component.css'],
    providers: [DonorService],
    directives:[MapComponent]
})
export class DonorDetailComponent implements OnInit, CanActivate, CanActivateChild{
    donor:PrivateDonor = {
        name:{
            first: '',
            last: ''
        },
        _id: '',
        private_id: '',
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

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        console.log(url);
        return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }
}