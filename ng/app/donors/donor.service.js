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
require('rxjs/add/operator/toPromise');
var http_1 = require("@angular/http");
var Observable_1 = require('rxjs/Observable');
var DonorService = (function () {
    function DonorService(http) {
        this.http = http;
        this.donorsUrl = '/api/donors';
        this.headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
    }
    DonorService.prototype.getDonors = function (bounds) {
        return this.http.get(this.donorsUrl + "?bounds=" + JSON.stringify(bounds))
            .map(this.extractData)
            .catch(this.handleError);
    };
    DonorService.prototype.getDonor = function (id) {
        var url = this.donorsUrl + "/" + id;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DonorService.prototype.update = function (donor) {
        var url = this.donorsUrl + "/" + donor._id;
        return this.http.put(url, JSON.stringify(donor), { headers: this.headers })
            .map(this.extractData)
            .catch(this.handleError);
    };
    DonorService.prototype.create = function (donor) {
        var url = "" + this.donorsUrl;
        var options = new http_1.RequestOptions({ headers: this.headers });
        return this.http.post(url, donor, options)
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    DonorService.prototype.del = function (id) {
        var url = this.donorsUrl + "/" + id;
        return this.http.delete(url, { headers: this.headers })
            .map(this.extractData)
            .catch(this.handleError);
    };
    DonorService.prototype.extractData = function (res) {
        var body = res.json();
        console.log(body.data);
        return body.data || body.status || {};
    };
    DonorService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message : error.status ? error.status + " - " + error.statusText : 'Server error';
        return Observable_1.Observable.throw(errMsg);
    };
    DonorService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DonorService);
    return DonorService;
}());
exports.DonorService = DonorService;
//# sourceMappingURL=donor.service.js.map