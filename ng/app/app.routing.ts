/**
 * Created by rohit on 7/9/16.
 */

import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {DonorComponent} from "./donors/donor.component";
import {PatientComponent} from "./patients/patient.component";

const appRoutes : Routes = [
    {
        path: 'donors',
        component: DonorComponent
    },
    {
        path: 'donors/:id',
        component: DonorComponent
    },
    {
        path: 'patients',
        component: PatientComponent
    },
    {
        path: '',
        redirectTo: '/donors',
        pathMatch: 'full'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);