/**
 * Created by rohit on 12/9/16.
 */

import "./rxjs-extensions";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {routing} from "./app.routing";
import {MapComponent} from "./maps/map.component";
import {DonorComponent} from "./donors/donor.component";
import {DonorService} from "./donors/donor.service";
import {PatientComponent} from "./patients/patient.component";
import {DonorDetailComponent} from "./donors/donor-detail.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        routing
    ],
    declarations: [
        AppComponent,
        MapComponent,
        DonorComponent,
        PatientComponent,
        DonorDetailComponent,
    ],
    providers: [ DonorService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
