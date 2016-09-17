/**
 * Created by rohit on 15/9/16.
 */

import {Component, OnInit, EventEmitter, Output, OnDestroy, ViewChild, AfterViewInit} from "@angular/core";
import {MapComponent} from "../maps/map.component";
import {DonorService} from "../donors/donor.service";
import * as io from "socket.io-client";

@Component({
    selector: 'patient',
    template: '<map-component [parent_component]="component_name" #map></map-component>',
    providers: [DonorService]
})
export class PatientComponent implements OnInit, OnDestroy, AfterViewInit{
    component_name:string="patient";
    socket:any;
    @Output() helpText = new EventEmitter();
    @ViewChild('map') mapComponent:MapComponent;

    ngOnInit(){
        this.socket = io();
        this.helpText.emit("Click on any of the points to load donor details");
    }

    ngOnDestroy(){
        this.socket.disconnect();
    }

    ngAfterViewInit() {
        this.listenSocketEvents();
    }

    listenSocketEvents(){
        this.socket.on("donors-add", donor => this.mapComponent.addDonorToMap(donor));
        this.socket.on("donors-update", donor => this.mapComponent.updateDonorOnMap(donor));
        this.socket.on("donors-delete", donor => this.mapComponent.removeDonorFromMap(donor));
    }
}