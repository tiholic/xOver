/**
 * Created by rohit on 7/9/16.
 */

import {Component, OnInit} from '@angular/core';
import * as io from "socket.io-client";
@Component({
    selector: 'my-app',
    templateUrl: 'ng/app/app.component.html',        //All router links to be added inside this template
    styleUrls: ['ng/app/app.component.css']
})
export class AppComponent implements OnInit{
    title = 'Blood Donation Management';
    socket;
    data:{name:{first:string, last:string}} = {name:{first:"ASdf", last:"Asdf"}};

    ngOnInit(){
        this.socket = io();
        this.listenSocketEvents();
    }

    listenSocketEvents(){
        this.socket.on("donors-add", msg => this.data.name=msg.name);
        this.socket.on("donors-update", msg => this.data.name=msg.name);
        this.socket.on("donors-delete", msg => {console.log(msg);this.data.name=msg.name;});
    }
}