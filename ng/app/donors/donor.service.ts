/**
 * Created by rohit on 14/9/16.
 */

import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable'
import {Donor} from "../donor";

@Injectable()
export class DonorService {

    private donorsUrl = '/api/donors';
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http){ }

    getDonors(): Observable<Donor[]> {
        return this.http.get(this.donorsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDonor(id: string): Observable<Donor> {
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

    del(id:String):Observable<Donor>{
        let url = `${this.donorsUrl}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .map(this.extractData)
            .catch(this.handleError)
    }

    private extractData(res: Response){
        let body = res.json();
        return body.data || body.status || {};
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
}