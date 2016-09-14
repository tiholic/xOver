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
var MapComponent = (function () {
    function MapComponent() {
    }
    MapComponent.prototype.ngOnInit = function () {
        requireModules([
            "esri/Map",
            "esri/widgets/Search",
            "esri/views/MapView",
            "esri/Graphic",
            "esri/symbols/Font",
            "esri/symbols/TextSymbol",
            "esri/geometry/Point",
            "esri/geometry/Multipoint",
            "esri/geometry/SpatialReference",
            "esri/PopupTemplate",
        ], function (Map, Search, MapView, Graphic, Font, TextSymbol, Point, Multipoint, SpatialReference, PopupTemplate) {
            var map = new Map({
                basemap: "streets"
            });
            var view = new MapView({
                container: "viewDiv",
                map: map,
                zoom: 2,
                center: [78.1, 20.6]
            });
            var searchWidget = new Search({
                view: view
            });
            view.ui.add(searchWidget, {
                position: 'top-left',
                index: 0,
                allPlaceholder: "search for Donors"
            });
            var textSymbol = new TextSymbol({
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
            var point = new Point({
                longitude: 79,
                latitude: 20,
                hasZ: false
            });
            var points = new Multipoint({
                points: [[79, 20], [79, 50]],
                spatialReference: new SpatialReference({ wkid: 4326 })
            });
            var pointAttr = {
                Name: "Keystone Pipeline",
                Owner: "TransCanada",
                Length: "3,456 km" // The length of the pipeline
            };
            var polylineGraphic = new Graphic({
                geometry: points,
                symbol: textSymbol,
                attributes: pointAttr,
                popupTemplate: new PopupTemplate({
                    title: "{Name}",
                    content: "{*}" // Displays a table of all the attributes in the popup
                })
            });
            view.graphics.add(polylineGraphic);
        });
    };
    MapComponent = __decorate([
        core_1.Component({
            selector: 'arcmap',
            templateUrl: 'ng/app/maps/map.component.html',
            styleUrls: ['ng/app/maps/map.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map