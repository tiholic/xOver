/**
 * Created by rohit on 7/9/16.
 */
 import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import {AppModule} from "./app.module";

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);