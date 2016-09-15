/**
 * Created by rohit on 14/9/16.
 */


import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {DonorComponent} from "../donors/donor.component";
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
    directives: [DonorComponent],
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
    @Input() parent_component:string;

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
                this.setViewExtent(null, null);
                var searchWidget = new Search({
                    view: this.view,
                });

                this.view.ui.add(searchWidget, {
                    position: 'top-left',
                    index: 0,
                    allPlaceholder: "search for Donors"
                });
                this.addEventsToMap();
                this.getLocationFromBrowser();
            },
            err => console.log("failed to load view resources", err)
        );
    }

    addEventsToMap():void{
        if(this.parent_component == "patient"){
            this.view.watch("extent", (newValue, oldValue, property, object) => {
                var maxBounds = this.getCoords(this.WebMercatorUtils.xyToLngLat(object.extent.xmax, object.extent.ymax));
                var minBounds = this.getCoords(this.WebMercatorUtils.xyToLngLat(object.extent.xmin, object.extent.ymin));
                var bounds:Bounds = {
                    min: minBounds,
                    max: maxBounds
                };
                this.loadDonors(bounds);
            });
        }else{
            this.view.on("click",
                evt => {
                    var coords: Coords = this.getCoords(evt.mapPoint);
                    /*  var address = (new s.TaskLocator()).locationToAddress(s.geometry, 0);
                     console.log(address);
                     unable to get address: issue from ESRI...
                     */
                    this.coordsReceived.emit(coords);
                    this.addPoint(coords);
                    this.center(coords);
                }
            );
        }
    }

    getCoords(coords):Coords{
        // rounding off the decimals to 3 decimals
        if(coords instanceof Array){
            return {
                latitude: Math.round(coords[1]*1000)/1000,
                longitude: Math.round(coords[0]*1000)/1000,
            }
        }
        return {
            latitude: Math.round(coords.latitude*1000)/1000,
            longitude: Math.round(coords.longitude*1000)/1000,
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

    createGraphic(geometry, attributes):any{
        var opts = {
            geometry: geometry,
            symbol: this.symbol
        };
        if(attributes){
            opts['attributes'] = attributes;
            opts['popupTemplate'] = new this.PopupTemplate({
                                        title: "{Name}",  // The title of the popup will be the name of the pipeline
                                        content: "{*}"    // Displays a table of all the attributes in the popup
                                    });
        }
        return new this.Graphic(opts);
    }

    addGraphic(graphic):void{
        this.view.graphics.add(graphic);
    }

    removeGraphic(graphic):void{
        this.view.graphics.add(graphic);
    }

    addPoint(coords):void{
        this.clearAll();
        this.appendPoint(coords, null, null);
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
        var newScale = (8*Math.pow(10,4));
       this.setViewExtent({center: [coords.longitude, coords.latitude]}, (newScale < this.view.scale)?newScale:this.view.scale);
    }

    setViewExtent(opts, scale):any{
        if(!opts){
            opts = {};
        }
        opts.spatialReference = new this.SpatialReference({wkid:4326});
        this.view.extent = new this.Extent(opts);
        this.view.scale = scale?scale:(5*Math.pow(10,7));
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
            "Name": `${donor.name.first} ${donor.name.last}`,
            "Blood Group": donor.blood_group.toUpperCase(),
            "Contact Number": donor.contact_number,
            "EMail": donor.email
        }
    }

    addDonorToMap(donor:Donor):any{
        this.appendPoint(donor.coordinates, this.getTemplateForDonor(donor), donor._id);
    }

    updateDonorOnMap(donor:Donor):any{
        this.removeGraphic(this.graphics[donor._id]);
        this.appendPoint(donor.coordinates, this.getTemplateForDonor(donor), donor._id);
    }

    removeDonorFromMap(donor:Donor):any{
        this.removeGraphic(this.graphics[donor._id]);
        delete this.graphics[donor._id];
    }

    loadDonors(bounds:Bounds):void{
        this.donorService.getDonors(bounds)
            .subscribe(
                donors => {
                    this.clearAll();
                    for(var index:number in donors){
                        this.addDonorToMap(donors[index]);
                    }
                },
                error => this.errorMessage = error
            )
    }
}
