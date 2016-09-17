/**
 * Created by rohit on 17/9/16.
 */


import {Component, Input} from "@angular/core";
@Component({
    selector: 'error',
    template: `<div [style.display]="display" [style.background-color]="backgroundColor">{{errorMessage}}</div>`,
    styles: [
        `
        div{
            height: 2em;
            line-height: 2em;
            color: white;
            background: red;
            text-align: center;
        }
        `
    ]
})
export class ErrorComponent{
    @Input() error:{
        type:string,
        message:string
    };
    display:string = "none";
    backgroundColor:string;
    constructor(){}

    setDisplay(){
        if(this.error){
            this.display = "block";
        }else{
            this.display = "none";
        }
    }

    setBg():void{
        if(!this.error){
            this.backgroundColor = "transparent";
        }
        if(this.error.type == "error"){
            this.backgroundColor = "red";
        }else if(this.error.type == "success"){
            this.backgroundColor = "green";
        }else{
            this.backgroundColor = "yellow"
        }
    }
}