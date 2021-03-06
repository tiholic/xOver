/**
 * Created by rohit on 7/9/16.
 */
"use strict";
var router_1 = require("@angular/router");
var donor_component_1 = require("./donors/donor.component");
var patient_component_1 = require("./patients/patient.component");
var donor_detail_component_1 = require("./donors/donor-detail.component");
var appRoutes = [
    {
        path: 'donors',
        component: donor_component_1.DonorComponent
    },
    {
        path: 'donors-detail',
        component: donor_detail_component_1.DonorDetailComponent
    },
    {
        path: 'patients',
        component: patient_component_1.PatientComponent
    },
    {
        path: '',
        redirectTo: '/donors',
        pathMatch: 'full'
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map