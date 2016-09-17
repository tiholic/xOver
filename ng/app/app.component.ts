/**
 * Created by rohit on 7/9/16.
 */

import {Component} from "@angular/core";
import {enableProdMode} from '@angular/core';
enableProdMode();
@Component({
    selector: 'my-app',
    templateUrl: 'ng/app/app.component.html',        //All router links to be added inside this template
    styleUrls: ['ng/app/app.component.css']
})
export class AppComponent {
    title = 'Blood Donation Management';
    help:string;

    updateHelp(help){
        this.help = help;
    }
}