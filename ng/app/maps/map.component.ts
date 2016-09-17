/**
 * Created by rohit on 14/9/16.
 */


import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {DonorService} from "../donors/donor.service";
import {Coords, Bounds, Donor} from "../objects";
declare var requireModules: any;

@Component({
    selector: 'map-component',
    template: '<div id="viewDiv" class="map-holder"></div>',
    styles: [
        `    
        .map-holder {
            padding: 0;
            margin: 0;
            height: 100%;
            width: 100%;
            float: left;
        }
    `
    ],
    providers: [DonorService]
})
export class MapComponent implements OnInit{

    Graphic:any;
    Multipoint:any;
    Point:any;
    PopupTemplate:any;
    Extent:any;
    SpatialReference:any;
    JSONUtils:any;
    WatchUtils:any;
    WebMercatorUtils:any;
    // TaskLocator:any;
    view:any;
    symbol:any;
    graphics:any = {};
    errorMessage:any;
    @Output() coordsReceived = new EventEmitter();
    @Output() mapModulesInitialised = new EventEmitter();
    @Input() parent_component:string;
    @Input() getLocate=true;
    extentChangeCounter:number = 0;

    constructor(private donorService:DonorService){}

    ngOnInit(){
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
            /*,"esri/tasks/Locator"*/
        ], (Map, MapView, Search, JSONUtils, Multipoint, Point, Graphic, PopupTemplate, Extent, SpatialReference, WatchUtils, WebMercatorUtils/*, TaskLocator*/) => {
            this.Multipoint = Multipoint;
            this.Point = Point;
            this.Graphic = Graphic;
            this.PopupTemplate = PopupTemplate;
            this.Extent = Extent;
            this.SpatialReference = SpatialReference;
            this.JSONUtils = JSONUtils;
            this.WatchUtils = WatchUtils;
            this.WebMercatorUtils = WebMercatorUtils;
            /*this.TaskLocator = TaskLocator;*/
            this.createMap(Map, MapView, Search);
            this.createSymbol();
        });
    }

    createMap(Map, MapView, Search):void{
        var map = new Map({
            basemap: "streets"
        });

        this.view = new MapView({
            container: "viewDiv",
            map: map,
            zoom: 3,
            center: [0,0]
        });
        this.view.then(
            () => {
                this.setScale(null);
                this.mapModulesInitialised.emit();
                var searchWidget = new Search({
                    view: this.view,
                });

                this.view.ui.add(searchWidget, {
                    position: 'top-left',
                    index: 0,
                    allPlaceholder: "search for Donors"
                });
                this.addEventsToMap();
                if(this.getLocate) {
                    this.getLocationFromBrowser();
                }
            },
            err => console.log("failed to load view resources", err)
        );
    }

    addEventsToMap():void{
        if(this.parent_component == "patient"){
            this.view.watch("extent",
                (newValue, oldValue, property, object) => {
                    var latestCounter = (++this.extentChangeCounter);
                    var s = this;
                    setTimeout(function(){
                        if(latestCounter == s.extentChangeCounter){
                            var maxBounds = s.getCoords(s.WebMercatorUtils.xyToLngLat(object.extent.xmax, object.extent.ymax));
                            var minBounds = s.getCoords(s.WebMercatorUtils.xyToLngLat(object.extent.xmin, object.extent.ymin));
                            var bounds:Bounds = {
                                min: minBounds,
                                max: maxBounds
                            };
                            s.loadDonors(bounds);
                        }
                    }, 500);
                }
            );
        }else{
            this.view.on("click",
                evt => {
                    var coords: Coords = this.getCoords(evt.mapPoint);
                    /*  var address = (new s.TaskLocator()).locationToAddress(s.geometry, 0);
                     console.log(address);
                     unable to get address: issue from ESRI...
                     */
                    this.coordsReceived.emit(coords);
                    this.addPoint(coords, null, null);
                    this.center(coords);
                }
            );
        }
    }

    getCoords(coords):Coords{
        // rounding off the decimals to 3 decimals
        if(coords instanceof Array){
            return {
                latitude: coords[1],
                longitude: coords[0],
            }
        }
        return {
            latitude: coords.latitude,
            longitude: coords.longitude,
        }
    }

    createSymbol():any{
        this.symbol = this.JSONUtils.fromJSON({
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriPMS",
            "url": "/static/map-pin.svg",
            "width": 30,
            "height": 25
        });
    }

    createPoint(coords):any{
        return new this.Point({
            x:coords.longitude,
            y:coords.latitude,
            hasZ: false
        });
    }

    createGraphic(geometry, popupTemplate):any{
        var opts = {
            geometry: geometry,
            symbol: this.symbol
        };
        if(popupTemplate){
            opts['popupTemplate'] = new this.PopupTemplate(popupTemplate);
        }
        return new this.Graphic(opts);
    }

    addGraphic(graphic):void{
        this.view.graphics.add(graphic);
    }

    removeGraphic(graphic):void{
        this.view.graphics.remove(graphic);
    }

    addPoint(coords, popupDetails, id):void{
        this.clearAll();
        this.appendPoint(coords, popupDetails, id);
    }

    appendPoint(coords, popupDetails, id):void{
        var point = this.createPoint(coords);
        var graphic = this.createGraphic(point, popupDetails);
        if(id){
            this.graphics[id] = graphic;
        }
        this.addGraphic(graphic);
    }

    center(coords):void{
        this.setScale((8*Math.pow(10,5)), false);
        this.view.goTo([coords.longitude, coords.latitude]);
    }

    setScale(ratio:number, zoomout:boolean=true):void{
        if(ratio && !zoomout){
            ratio = (ratio<this.view.scale)?ratio:this.view.scale;
        }
        this.view.scale = ratio?ratio:(5*Math.pow(10,7));
    }

    clearAll():void{
        this.view.graphics.removeAll();
    }

    getLocationFromBrowser():any{
        navigator.geolocation.getCurrentPosition(
            GeoPosition => {
                this.center(GeoPosition.coords);
            },
            err => console.log(err.message)
        );
    }

    getTemplateForDonor(donor:Donor){
        return {
            "title": `${donor.name.first} ${donor.name.last}`,
            "content": this.getPopupContent(donor)
            }
    }

    getPopupContent(donor:Donor){
        return `
                    <table data-donorId="${donor._id}">
                        <tr><td>Name</td><td>${donor.name.first} ${donor.name.last}</td></tr>    
                        <tr><td>Blood Group</td><td>${donor.blood_group.toUpperCase()}</td></tr>    
                        <tr><td>Contact Number</td><td><a href="javascript:void(0)" onclick="this.parentElement.innerHTML='${donor.contact_number}'">(Click To Show)</a></td></tr>    
                        <tr><td>Email</td><td><a href="javascript:void(0)" onclick="this.parentElement.innerHTML='${donor.email}'">(Click To Show)</a></td></tr>    
                    </table>
                `;
    }

    addDonorToMap(donor:Donor):any{
        this.appendPoint(donor.coordinates, this.getTemplateForDonor(donor), donor._id);
    }

    updateDonorOnMap(donor:Donor):any{
        this.removeGraphic(this.graphics[donor._id]);
        this.appendPoint(donor.coordinates, this.getTemplateForDonor(donor), donor._id);
        this.updatePopup(donor, false);
    }

    removeDonorFromMap(donor:Donor):any{
        this.removeGraphic(this.graphics[donor._id]);
        delete this.graphics[donor._id];
        this.updatePopup(donor, true);
    }

    updatePopup(donor:Donor, remove){
        if(this.view.popup.visible && this.view.popup._bodyContentNode.getElementsByTagName('table')[0].dataset.donorid == donor._id){
            if(remove){
                this.view.popup._closeNode.click();
            }else{
                this.view.popup.content = this.getPopupContent(donor);
/*                this.view.popup.location = new this.Point({
                                                        longitude:donor.coordinates.longitude,
                                                        latitude:donor.coordinates.latitude,
                                                        hasZ:false
                                                        });
                this updates the popup to center. Incorrect.
                                                        */
            }
        }
    }

    loadDonors(bounds:Bounds):void{
        this.donorService.getDonors(bounds)
            .subscribe(
                donors => {
                    this.clearAll();
                    for(var index in donors){
                        this.addDonorToMap(donors[index]);
                    }
                },
                error => this.errorMessage = error
            )
    }
}
