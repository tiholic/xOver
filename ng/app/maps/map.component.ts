/**
 * Created by rohit on 14/9/16.
 */


import {Component, OnInit} from "@angular/core";
declare var requireModules: any;

@Component({
    selector: 'arcmap',
    templateUrl: 'ng/app/maps/map.component.html',
    styleUrls: ['ng/app/maps/map.component.css']
})
export class MapComponent implements OnInit{

    constructor(){}

    ngOnInit(){
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
        ], function(Map, Search, MapView, Graphic, Font, TextSymbol, Point, Multipoint, SpatialReference, PopupTemplate) {

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
                font: {  // autocast as esri/symbols/Font
                    size: 12,
                    family: "sans-serif",
                    weight: "bolder"
                }
            });

            var point = new Point({
                longitude:79,
                latitude:20,
                hasZ:false
            });

            var points = new Multipoint({
                points: [[79,20],[79,50]],
                spatialReference:new SpatialReference({ wkid: 4326 })
            });

            var pointAttr = {
                Name: "Keystone Pipeline",  // The name of the pipeline
                Owner: "TransCanada",  // The owner of the pipeline
                Length: "3,456 km"  // The length of the pipeline
            };

            var polylineGraphic = new Graphic({
                geometry: points,
                symbol: textSymbol,
                attributes: pointAttr,
                popupTemplate: new PopupTemplate({
                    title: "{Name}",  // The title of the popup will be the name of the pipeline
                    content: "{*}"    // Displays a table of all the attributes in the popup
                })
            });
            view.graphics.add(polylineGraphic);

        });
    }
}