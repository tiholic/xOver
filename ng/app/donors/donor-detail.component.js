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
        this.mapInitialised = false;
        this.deleted = false;
        this.updated = false;
        this.host = window.location.host;
    }
    DonorDetailComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var params = window.location.search.substring(1).split('&');
        var donor_id = params[0].split('=')[1];
        this.donorPrivate = params[1].split('=')[1];
        this.donorService.getDonor(donor_id).subscribe(function (donor) {
            _this.donor = donor;
            if (_this.mapInitialised) {
                _this.pointDonor();
            }
        }, function (err) { return console.log(err); });
    };
    DonorDetailComponent.prototype.pointDonor = function () {
        this.mapInitialised = true;
        this.mapComponent.addDonorToMap(this.donor);
    };
    DonorDetailComponent.prototype.updateDonor = function () {
        var _this = this;
        if (this.validate()) {
            this.donorService.update(this.donor, this.donorPrivate).subscribe(function (donor) {
                _this.updated = true;
                var s = _this;
                setTimeout(function () {
                    s.updated = false;
                }, 5000);
            }, function (err) { return console.log(err); });
        }
    };
    DonorDetailComponent.prototype.deleteDonor = function () {
        var _this = this;
        this.donorService.del(this.donor._id).subscribe(function (status) {
            if (status.success) {
                _this.deleted = true;
            }
        }, function (err) { return console.log(err); });
    };
    DonorDetailComponent.prototype.setCoords = function (coordinates) {
        this.donor.coordinates = coordinates;
    };
    DonorDetailComponent.prototype.validate = function () {
        this.errors = [];
        var rawDonor = this.donor;
        var err = false;
        if (!rawDonor.name.first || (rawDonor.name.first != undefined && rawDonor.name.first.trim() == "")) {
            this.errors.push('name.first');
            err = true;
        }
        if (!(/^(00|\+)[0-9]{12}$/.test(rawDonor.contact_number))) {
            this.errors.push('contact_number');
            err = true;
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(rawDonor.email))) {
            this.errors.push('email');
            err = true;
        }
        if (!(/^(a|b|o|ab)(\+|\-)$/.test(rawDonor.blood_group.toLowerCase()))) {
            this.errors.push('blood_group');
            err = true;
        }
        return !(err);
    };
    __decorate([
        core_1.ViewChild('map'), 
        __metadata('design:type', map_component_1.MapComponent)
    ], DonorDetailComponent.prototype, "mapComponent", void 0);
    DonorDetailComponent = __decorate([
        core_1.Component({
            selector: 'donor-detail',
            templateUrl: 'ng/app/donors/donor-detail.component.html',
            styleUrls: ['ng/app/donors/donor.component.css'],
            providers: [donor_service_1.DonorService]
        }), 
        __metadata('design:paramtypes', [donor_service_1.DonorService, router_1.Router])
    ], DonorDetailComponent);
    return DonorDetailComponent;
}());
exports.DonorDetailComponent = DonorDetailComponent;
//# sourceMappingURL=donor-detail.component.js.map