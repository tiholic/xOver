/**
 * Created by rohit on 14/9/16.
 */


import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {DonorComponent} from "../donors/donor.component";
declare var requireModules: any;

@Component({
    selector: 'map-component',
    template: '<div id="viewDiv" class="arcMap"></div>',
    styles: [
    `    
        .arcMap {
            padding: 0;
            margin: 0;
            height: 650px;
            width: 1000px;
            float: left;
        }
    `
],
    directives: [DonorComponent]
})
export class MapComponent implements OnInit{

    Graphic:any;
    Multipoint:any;
    Point:any;
    PopupTemplate:any;
    view:any;
    symbol:any;
    geometry:any;
    graphic:any;
    @Output() coordsRecieved = new EventEmitter();
    @Input() parent:string;

    constructor(){}

    ngOnInit(){
        requireModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Search",
            "esri/symbols/TextSymbol",
            "esri/geometry/Multipoint",
            "esri/geometry/Point",
            "esri/Graphic",
            "esri/PopupTemplate",
        ], (Map, MapView, Search, TextSymbol, Multipoint, Point, Graphic, PopupTemplate) => {
            this.Multipoint = Multipoint;
            this.Point = Point;
            this.Graphic = Graphic;
            this.PopupTemplate = PopupTemplate;
            this.createMap(Map, MapView, Search);
            this.createSymbol(TextSymbol);
        });
    }

    createMap(Map, MapView, Search):void{
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
    }

    createSymbol(TextSymbol):void{
        this.symbol = new TextSymbol({
            color: "red",
            haloColor: "black",
            haloSize: "1px",
            text: "A+",
            xoffset: 3,
            yoffset: 3,
            font: {  // autocast as esri/symbols/Font
                size: 12,
                family: "sans-serif",
                weight: "bolder"
            }
        });
    }

    getGeometry(points):void{
        if(points instanceof Array){
            this.geometry = new this.Multipoint({
                points: [[79, 20], [79, 50]]
            });
        }else {
            this.geometry = new this.Point({
                x:points.longitude,
                y:points.latitude,
                hasZ: false
            });
        }
        this.createGraphic();
        this.addGraphic();
    };

    createGraphic():void{
        var pointAttr = {
            Name: "Keystone Pipeline",  // The name of the pipeline
            Owner: "TransCanada",  // The owner of the pipeline
            Length: "3,456 km"  // The length of the pipeline
        };

        this.graphic = new this.Graphic({
            geometry: this.geometry,
            symbol: this.symbol,
            attributes: pointAttr,
            popupTemplate: new this.PopupTemplate({
                title: "{Name}",  // The title of the popup will be the name of the pipeline
                content: "{*}"    // Displays a table of all the attributes in the popup
            })
        });
    }

    addGraphic():void{
        this.view.graphics.add(this.graphic);
    }

    addRandomClickEvent():void{
        var s = this;
        s.view.on("click", function(evt) {
            // Get the coordinates of the click on the view
            // around the decimals to 3 decimals
            var coords = {
                latitude : Math.round(evt.mapPoint.latitude * 1000) / 1000,
                longitude : Math.round(evt.mapPoint.longitude * 1000) / 1000
            };
            s.coordsRecieved.emit(coords);
            s.view.graphics.removeAll();
            s.getGeometry(coords);
        });
    }
}