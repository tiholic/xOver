/**
 * Created by rohit on 15/9/16.
 */

import {Component} from "@angular/core";
import {MapComponent} from "../maps/map.component";
import {DonorService} from "../donors/donor.service";
@Component({
    selector: 'patient',
    template: '<map-component></map-component>',
    directives: [MapComponent],
    providers: [DonorService]
})
export class PatientComponent{

}