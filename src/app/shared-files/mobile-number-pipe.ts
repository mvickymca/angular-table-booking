import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'mobileNumberPipeConverter'
})

export class MobileNumberPipeConverter implements PipeTransform
{
    transform( val:String):String{

       
        let newStr:String = '';
        newStr=val.substr(0,3)+'-'+val.substr(3,3)+'-'+val.substr(6,4);
        return newStr;
      
    }
}