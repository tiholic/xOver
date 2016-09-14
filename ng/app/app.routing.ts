/**
 * Created by rohit on 7/9/16.
 */

import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {MapComponent} from "./maps/map.component"

const appRoutes : Routes = [
    {
        path: '',
        component: MapComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);