/**
 * Created by rohit on 7/9/16.
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
var core_1 = require('@angular/core');
var io = require("socket.io-client");
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'Blood Donation Management';
        this.data = { name: { first: "ASdf", last: "Asdf" } };
    }
    AppComponent.prototype.ngOnInit = function () {
        this.socket = io();
        this.listenSocketEvents();
    };
    AppComponent.prototype.listenSocketEvents = function () {
        var _this = this;
        this.socket.on("donors-add", function (msg) { return _this.data.name = msg.name; });
        this.socket.on("donors-update", function (msg) { return _this.data.name = msg.name; });
        this.socket.on("donors-delete", function (msg) { console.log(msg); _this.data.name = msg.name; });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'ng/app/app.component.html',
            styleUrls: ['ng/app/app.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map