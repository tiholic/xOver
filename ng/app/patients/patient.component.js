/**
 * Created by rohit on 15/9/16.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var map_component_1 = require("../maps/map.component");
var donor_service_1 = require("../donors/donor.service");
var io = require("socket.io-client");
var PatientComponent = (function () {
    function PatientComponent() {
        this.component_name = "patient";
        this.helpText = new core_1.EventEmitter();
    }
    PatientComponent.prototype.ngOnInit = function () {
        this.socket = io();
        this.helpText.emit("Click on any of the points to load donor details");
    };
    PatientComponent.prototype.ngOnDestroy = function () {
        this.socket.disconnect();
    };
    PatientComponent.prototype.ngAfterViewInit = function () {
        this.listenSocketEvents();
    };
    PatientComponent.prototype.listenSocketEvents = function () {
        var _this = this;
        this.socket.on("donors-add", function (donor) { return _this.mapComponent.addDonorToMap(donor); });
        this.socket.on("donors-update", function (donor) { return _this.mapComponent.updateDonorOnMap(donor); });
        this.socket.on("donors-delete", function (donor) { console.log('donor deleted'); _this.mapComponent.removeDonorFromMap(donor); });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PatientComponent.prototype, "helpText", void 0);
    __decorate([
        core_1.ViewChild('map'), 
        __metadata('design:type', map_component_1.MapComponent)
    ], PatientComponent.prototype, "mapComponent", void 0);
    PatientComponent = __decorate([
        core_1.Component({
            selector: 'patient',
            template: '<map-component [parent_component]="component_name" #map></map-component>',
            directives: [map_component_1.MapComponent],
            providers: [donor_service_1.DonorService]
        }), 
        __metadata('design:paramtypes', [])
    ], PatientComponent);
    return PatientComponent;
}());
exports.PatientComponent = PatientComponent;
//# sourceMappingURL=patient.component.js.map