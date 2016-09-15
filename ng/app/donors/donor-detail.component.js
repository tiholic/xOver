/**
 * Created by rohit on 16/9/16.
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
var router_1 = require("@angular/router");
var donor_service_1 = require("./donor.service");
var map_component_1 = require("../maps/map.component");
var DonorDetailComponent = (function () {
    function DonorDetailComponent(donorService, router) {
        this.donorService = donorService;
        this.router = router;
        this.donor = {
            name: {
                first: '',
                last: ''
            },
            _id: '',
            contact_number: '',
            email: '',
            blood_group: '',
            coordinates: {
                latitude: 100,
                longitude: 200
            }
        };
        this.errors = [];
    }
    DonorDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        var params = window.location.search.substring(1).split('&');
        var pmap = {
            donor_id: null,
            donor_private: null
        };
        for (var i in params) {
            var kv = params[i].split('=');
            pmap[kv[0]] = kv[1];
        }
        this.donorService.getDonor(pmap.donor_id).subscribe(function (donor) { return _this.donor = donor; }, function (err) { return console.log(err); });
    };
    DonorDetailComponent = __decorate([
        core_1.Component({
            selector: 'donor-detail',
            templateUrl: 'ng/app/donors/donor-detail.component.html',
            styleUrls: ['ng/app/donors/donor.component.css'],
            providers: [donor_service_1.DonorService],
            directives: [map_component_1.MapComponent]
        }), 
        __metadata('design:paramtypes', [donor_service_1.DonorService, router_1.Router])
    ], DonorDetailComponent);
    return DonorDetailComponent;
}());
exports.DonorDetailComponent = DonorDetailComponent;
//# sourceMappingURL=donor-detail.component.js.map