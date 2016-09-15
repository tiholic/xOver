/**
 * Created by rohit on 14/9/16.
 */

import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable'
import {Donor, Bounds, RawDonor} from "../objects";

@Injectable()
export class DonorService {

    private donorsUrl = '/api/donors';
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http){ }

    getDonors(bounds:Bounds): Observable<Donor[]> {
        return this.http.get(`${this.donorsUrl}?bounds=${JSON.stringify(bounds)}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDonor(id: string): Observable<any> {
        const url = `${this.donorsUrl}/${id}`;
        return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
    }

    update(donor:Donor):Observable<Donor>{
        const url = `${this.donorsUrl}/${donor._id}`;
        return this.http.put(url, JSON.stringify(donor), {headers: this.headers})
            .map(this.extractData)
            .catch(this.handleError)
    }

    create(donor:any):Observable<any>{
        const url = `${this.donorsUrl}`;
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, donor, options)
            .map((response)=>response.json())
            .catch(this.handleError)
    }

    del(id:String):Observable<any>{
        let url = `${this.donorsUrl}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .map(this.extractData)
            .catch(this.handleError)
    }

    private extractData(res: Response){
        let body = res.json();
        console.log(body.data);
        return body.data || body.status || {};
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
}