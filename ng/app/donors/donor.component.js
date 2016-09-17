/**
 * Created by rohit on 14/9/16.
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
var donor_service_1 = require("./donor.service");
var router_1 = require("@angular/router");
var DonorComponent = (function () {
    function DonorComponent(donorService, router) {
        this.donorService = donorService;
        this.router = router;
        this.errors = [];
        this.component_name = "donor";
        this.rawDonor = {
            name: {
                first: 'Rohit',
                last: 'Reddy'
            },
            contact_number: '00917382393393',
            email: 'rr.16566@gmail.com',
            blood_group: 'B+',
            coordinates: {
                latitude: 100,
                longitude: 200
            }
        };
        this.host = window.location.host;
        this.helpText = new core_1.EventEmitter();
    }
    DonorComponent.prototype.ngOnInit = function () {
        this.helpText.emit("Click on any point on map to fill your details and save to donors list");
    };
    DonorComponent.prototype.addDonor = function () {
        var _this = this;
        if (this.validate()) {
            this.donorService.create(JSON.stringify(this.rawDonor))
                .subscribe(function (data) {
                if (data.status.success) {
                    _this.success = true;
                    _this.donor = data.data;
                }
                else {
                    _this.success = false;
                    _this.errors = Object.keys(data.status.detail.errors);
                }
            }, function (error) { return _this.errorMessage = error; });
        }
    };
    DonorComponent.prototype.getDonor = function (id) {
        var _this = this;
        this.donorService.getDonor(id)
            .subscribe(function (donor) { return _this.donor = donor; }, function (error) { return _this.errorMessage = error; });
    };
    DonorComponent.prototype.validate = function () {
        this.errors = [];
        var rawDonor = this.rawDonor;
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
    DonorComponent.prototype.setCoords = function (coordinates) {
        this.rawDonor.coordinates = coordinates;
    };
    DonorComponent.prototype.closeForm = function () {
        this.rawDonor.coordinates = {
            latitude: 100,
            longitude: 200
        };
    };
    DonorComponent.prototype.resetForm = function () {
        this.rawDonor = {
            name: {
                first: '',
                last: ''
            },
            contact_number: '',
            email: '',
            blood_group: '',
            coordinates: {
                latitude: 100,
                longitude: 200
            }
        };
        this.success = false;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DonorComponent.prototype, "helpText", void 0);
    DonorComponent = __decorate([
        core_1.Component({
            selector: 'donor',
            templateUrl: 'ng/app/donors/donor.component.html',
            styleUrls: ['ng/app/donors/donor.component.css'],
            providers: [donor_service_1.DonorService]
        }), 
        __metadata('design:paramtypes', [donor_service_1.DonorService, router_1.Router])
    ], DonorComponent);
    return DonorComponent;
}());
exports.DonorComponent = DonorComponent;
//# sourceMappingURL=donor.component.js.map