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
var donor_component_1 = require("../donors/donor.component");
var MapComponent = (function () {
    function MapComponent() {
        this.coordsRecieved = new core_1.EventEmitter();
    }
    MapComponent.prototype.ngOnInit = function () {
        var _this = this;
        requireModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Search",
            "esri/symbols/TextSymbol",
            "esri/geometry/Multipoint",
            "esri/geometry/Point",
            "esri/Graphic",
            "esri/PopupTemplate",
        ], function (Map, MapView, Search, TextSymbol, Multipoint, Point, Graphic, PopupTemplate) {
            _this.Multipoint = Multipoint;
            _this.Point = Point;
            _this.Graphic = Graphic;
            _this.PopupTemplate = PopupTemplate;
            _this.createMap(Map, MapView, Search);
            _this.createSymbol(TextSymbol);
        });
    };
    MapComponent.prototype.createMap = function (Map, MapView, Search) {
        var map = new Map({
            basemap: "streets"
        });
        this.view = new MapView({
            container: "viewDiv",
            map: map,
            zoom: 2,
            center: [78.1, 20.6]
        });
        var searchWidget = new Search({
            view: this.view
        });
        this.view.ui.add(searchWidget, {
            position: 'top-left',
            index: 0,
            allPlaceholder: "search for Donors"
        });
        this.addRandomClickEvent();
    };
    MapComponent.prototype.createSymbol = function (TextSymbol) {
        this.symbol = new TextSymbol({
            color: "red",
            haloColor: "black",
            haloSize: "1px",
            text: "A+",
            xoffset: 3,
            yoffset: 3,
            font: {
                size: 12,
                family: "sans-serif",
                weight: "bolder"
            }
        });
    };
    MapComponent.prototype.getGeometry = function (points) {
        if (points instanceof Array) {
            this.geometry = new this.Multipoint({
                points: [[79, 20], [79, 50]]
            });
        }
        else {
            this.geometry = new this.Point({
                x: points.longitude,
                y: points.latitude,
                hasZ: false
            });
        }
        this.createGraphic();
        this.addGraphic();
    };
    ;
    MapComponent.prototype.createGraphic = function () {
        var pointAttr = {
            Name: "Keystone Pipeline",
            Owner: "TransCanada",
            Length: "3,456 km" // The length of the pipeline
        };
        this.graphic = new this.Graphic({
            geometry: this.geometry,
            symbol: this.symbol,
            attributes: pointAttr,
            popupTemplate: new this.PopupTemplate({
                title: "{Name}",
                content: "{*}" // Displays a table of all the attributes in the popup
            })
        });
    };
    MapComponent.prototype.addGraphic = function () {
        this.view.graphics.add(this.graphic);
    };
    MapComponent.prototype.addRandomClickEvent = function () {
        var s = this;
        s.view.on("click", function (evt) {
            // Get the coordinates of the click on the view
            // around the decimals to 3 decimals
            var coords = {
                latitude: Math.round(evt.mapPoint.latitude * 1000) / 1000,
                longitude: Math.round(evt.mapPoint.longitude * 1000) / 1000
            };
            s.coordsRecieved.emit(coords);
            s.view.graphics.removeAll();
            s.getGeometry(coords);
        });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "coordsRecieved", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MapComponent.prototype, "parent", void 0);
    MapComponent = __decorate([
        core_1.Component({
            selector: 'map-component',
            template: '<div id="viewDiv" class="arcMap"></div>',
            styles: [
                "    \n        .arcMap {\n            padding: 0;\n            margin: 0;\n            height: 650px;\n            width: 1000px;\n            float: left;\n        }\n    "
            ],
            directives: [donor_component_1.DonorComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map