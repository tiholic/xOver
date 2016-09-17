/**
 * Created by rohit on 17/9/16.
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
var ErrorComponent = (function () {
    function ErrorComponent() {
        this.display = "none";
    }
    ErrorComponent.prototype.setDisplay = function () {
        if (this.error) {
            this.display = "block";
        }
        else {
            this.display = "none";
        }
    };
    ErrorComponent.prototype.setBg = function () {
        if (!this.error) {
            this.backgroundColor = "transparent";
        }
        if (this.error.type == "error") {
            this.backgroundColor = "red";
        }
        else if (this.error.type == "success") {
            this.backgroundColor = "green";
        }
        else {
            this.backgroundColor = "yellow";
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ErrorComponent.prototype, "error", void 0);
    ErrorComponent = __decorate([
        core_1.Component({
            selector: 'error',
            template: "<div [style.display]=\"display\" [style.background-color]=\"backgroundColor\">{{errorMessage}}</div>",
            styles: [
                "\n        div{\n            height: 2em;\n            line-height: 2em;\n            color: white;\n            background: red;\n            text-align: center;\n        }\n        "
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ErrorComponent);
    return ErrorComponent;
}());
exports.ErrorComponent = ErrorComponent;
//# sourceMappingURL=error.component.js.map