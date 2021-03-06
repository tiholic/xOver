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
var donor_service_1 = require("../donors/donor.service");
var MapComponent = (function () {
    function MapComponent(donorService) {
        this.donorService = donorService;
        this.graphics = {};
        this.coordsReceived = new core_1.EventEmitter();
        this.mapModulesInitialised = new core_1.EventEmitter();
        this.getLocate = true;
        this.extentChangeCounter = 0;
    }
    MapComponent.prototype.ngOnInit = function () {
        var _this = this;
        requireModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Search",
            "esri/symbols/support/jsonUtils",
            "esri/geometry/Multipoint",
            "esri/geometry/Point",
            "esri/Graphic",
            "esri/PopupTemplate",
            "esri/geometry/Extent",
            "esri/geometry/SpatialReference",
            "esri/core/watchUtils",
            "esri/geometry/support/webMercatorUtils"
        ], function (Map, MapView, Search, JSONUtils, Multipoint, Point, Graphic, PopupTemplate, Extent, SpatialReference, WatchUtils, WebMercatorUtils /*, TaskLocator*/) {
            _this.Multipoint = Multipoint;
            _this.Point = Point;
            _this.Graphic = Graphic;
            _this.PopupTemplate = PopupTemplate;
            _this.Extent = Extent;
            _this.SpatialReference = SpatialReference;
            _this.JSONUtils = JSONUtils;
            _this.WatchUtils = WatchUtils;
            _this.WebMercatorUtils = WebMercatorUtils;
            /*this.TaskLocator = TaskLocator;*/
            _this.createMap(Map, MapView, Search);
            _this.createSymbol();
        });
    };
    MapComponent.prototype.createMap = function (Map, MapView, Search) {
        var _this = this;
        var map = new Map({
            basemap: "streets"
        });
        this.view = new MapView({
            container: "viewDiv",
            map: map,
            zoom: 3,
            center: [0, 0]
        });
        this.view.then(function () {
            _this.setScale(null);
            _this.mapModulesInitialised.emit();
            var searchWidget = new Search({
                view: _this.view,
            });
            _this.view.ui.add(searchWidget, {
                position: 'top-left',
                index: 0,
                allPlaceholder: "search for Donors"
            });
            _this.addEventsToMap();
            if (_this.getLocate) {
                _this.getLocationFromBrowser();
            }
        }, function (err) { return console.log("failed to load view resources", err); });
    };
    MapComponent.prototype.addEventsToMap = function () {
        var _this = this;
        if (this.parent_component == "patient") {
            this.view.watch("extent", function (newValue, oldValue, property, object) {
                var latestCounter = (++_this.extentChangeCounter);
                var s = _this;
                setTimeout(function () {
                    if (latestCounter == s.extentChangeCounter) {
                        s.loadDonors(s.getBounds(object.extent));
                    }
                }, 500);
            });
        }
        else {
            this.view.on("click", function (evt) {
                var coords = _this.getCoords(evt.mapPoint);
                /*  var address = (new s.TaskLocator()).locationToAddress(s.geometry, 0);
                 console.log(address);
                 unable to get address: issue from ESRI...
                 */
                _this.coordsReceived.emit(coords);
                _this.addPoint(coords, null, null);
                _this.center(coords);
            });
        }
    };
    MapComponent.prototype.getCoords = function (coords) {
        // rounding off the decimals to 3 decimals
        if (coords instanceof Array) {
            return {
                latitude: coords[1],
                longitude: coords[0],
            };
        }
        return {
            latitude: coords.latitude,
            longitude: coords.longitude,
        };
    };
    MapComponent.prototype.createSymbol = function () {
        this.symbol = this.JSONUtils.fromJSON({
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriPMS",
            "url": "/static/map-pin.svg",
            "width": 30,
            "height": 25
        });
    };
    MapComponent.prototype.createPoint = function (coords) {
        return new this.Point({
            x: coords.longitude,
            y: coords.latitude,
            hasZ: false
        });
    };
    MapComponent.prototype.createGraphic = function (geometry, popupTemplate) {
        var opts = {
            geometry: geometry,
            symbol: this.symbol
        };
        if (popupTemplate) {
            opts['popupTemplate'] = new this.PopupTemplate(popupTemplate);
        }
        return new this.Graphic(opts);
    };
    MapComponent.prototype.addGraphic = function (graphic) {
        this.view.graphics.add(graphic);
    };
    MapComponent.prototype.removeGraphic = function (graphic) {
        this.view.graphics.remove(graphic);
    };
    MapComponent.prototype.addPoint = function (coords, popupDetails, id) {
        this.clearAll();
        this.appendPoint(coords, popupDetails, id);
    };
    MapComponent.prototype.appendPoint = function (coords, popupDetails, id) {
        var point = this.createPoint(coords);
        var graphic = this.createGraphic(point, popupDetails);
        if (id) {
            this.graphics[id] = graphic;
        }
        this.addGraphic(graphic);
    };
    MapComponent.prototype.center = function (coords) {
        this.setScale((8 * Math.pow(10, 5)), false);
        this.view.goTo([coords.longitude, coords.latitude]);
    };
    MapComponent.prototype.setScale = function (ratio, zoomout) {
        if (zoomout === void 0) { zoomout = true; }
        if (ratio && !zoomout) {
            ratio = (ratio < this.view.scale) ? ratio : this.view.scale;
        }
        this.view.scale = ratio ? ratio : (5 * Math.pow(10, 7));
    };
    MapComponent.prototype.clearAll = function () {
        this.view.graphics.removeAll();
    };
    MapComponent.prototype.getLocationFromBrowser = function () {
        var _this = this;
        navigator.geolocation.getCurrentPosition(function (GeoPosition) {
            _this.center(GeoPosition.coords);
        }, function (err) {
            console.log(err.message);
            if (_this.parent_component == "patient") {
                _this.loadDonors(_this.getBounds());
            }
        });
    };
    MapComponent.prototype.getTemplateForDonor = function (donor) {
        return {
            "title": donor.name.first + " " + donor.name.last,
            "content": this.getPopupContent(donor)
        };
    };
    MapComponent.prototype.getPopupContent = function (donor) {
        return "\n                    <table data-donorId=\"" + donor._id + "\">\n                        <tr><td>Name</td><td>" + donor.name.first + " " + donor.name.last + "</td></tr>    \n                        <tr><td>Blood Group</td><td>" + donor.blood_group.toUpperCase() + "</td></tr>    \n                        <tr><td>Contact Number</td><td><a href=\"javascript:void(0)\" onclick=\"this.parentElement.innerHTML='" + donor.contact_number + "'\">(Click To Show)</a></td></tr>    \n                        <tr><td>Email</td><td><a href=\"javascript:void(0)\" onclick=\"this.parentElement.innerHTML='" + donor.email + "'\">(Click To Show)</a></td></tr>    \n                    </table>\n                ";
    };
    MapComponent.prototype.addDonorToMap = function (donor) {
        this.appendPoint(donor.coordinates, this.getTemplateForDonor(donor), donor._id);
    };
    MapComponent.prototype.updateDonorOnMap = function (donor) {
        this.removeGraphic(this.graphics[donor._id]);
        this.appendPoint(donor.coordinates, this.getTemplateForDonor(donor), donor._id);
        this.updatePopup(donor, false);
    };
    MapComponent.prototype.removeDonorFromMap = function (donor) {
        this.removeGraphic(this.graphics[donor._id]);
        delete this.graphics[donor._id];
        this.updatePopup(donor, true);
    };
    MapComponent.prototype.updatePopup = function (donor, remove) {
        if (this.view.popup.visible && this.view.popup._bodyContentNode.getElementsByTagName('table')[0].dataset.donorid == donor._id) {
            if (remove) {
                this.view.popup._closeNode.click();
            }
            else {
                this.view.popup.content = this.getPopupContent(donor);
            }
        }
    };
    MapComponent.prototype.getBounds = function (obj) {
        if (obj === void 0) { obj = this.view.extent; }
        var maxBounds = this.getCoords(this.WebMercatorUtils.xyToLngLat(obj.xmax, obj.ymax));
        var minBounds = this.getCoords(this.WebMercatorUtils.xyToLngLat(obj.xmin, obj.ymin));
        var bounds = {
            min: minBounds,
            max: maxBounds
        };
        return bounds;
    };
    MapComponent.prototype.loadDonors = function (bounds) {
        var _this = this;
        this.donorService.getDonors(bounds)
            .subscribe(function (donors) {
            _this.clearAll();
            for (var index in donors) {
                _this.addDonorToMap(donors[index]);
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "coordsReceived", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "mapModulesInitialised", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MapComponent.prototype, "parent_component", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "getLocate", void 0);
    MapComponent = __decorate([
        core_1.Component({
            selector: 'map-component',
            template: '<div id="viewDiv" class="map-holder"></div>',
            styles: [
                "    \n        .map-holder {\n            padding: 0;\n            margin: 0;\n            height: 100%;\n            width: 100%;\n            float: left;\n        }\n    "
            ],
            providers: [donor_service_1.DonorService]
        }), 
        __metadata('design:paramtypes', [donor_service_1.DonorService])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map