import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'mobileNumberPipeConverter'
})

export class MobileNumberPipeConverter implements PipeTransform
{
    transform(val: string | null | undefined): string {
        // Input validation and null checks
        if (!val || typeof val !== 'string') {
            return '';
        }
        
        // Remove any non-digit characters for sanitization
        const cleanVal = val.replace(/\D/g, '');
        
        // Validate length - should be exactly 10 digits for US phone numbers
        if (cleanVal.length !== 10) {
            return val; // Return original if not valid format
        }
        
        // Format as XXX-XXX-XXXX
        const newStr = cleanVal.substr(0,3) + '-' + cleanVal.substr(3,3) + '-' + cleanVal.substr(6,4);
        return newStr;
    }
}