import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    static notOnlyWhiteSpace(formControl: FormControl) : ValidationErrors | null {
        if((formControl.value != null) && (formControl.value.trim().length == 0) ) {
            return {'notOnlyWhiteSpace':true};
        } else {
            return null;
        }
    }
    
}
