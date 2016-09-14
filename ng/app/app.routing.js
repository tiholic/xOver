/**
 * Created by rohit on 7/9/16.
 */
"use strict";
var router_1 = require("@angular/router");
var map_component_1 = require("./maps/map.component");
var appRoutes = [
    {
        path: '',
        component: map_component_1.MapComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map