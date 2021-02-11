export const RegisterVal = function (value){
        // debugger
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    if (!value){
        return 'This field is required';
    }
    if (value.length>14){
        return 'Maximum length - 15 characters';
    }
    if (value.length<3){
        return 'Minimum length - 3 characters';
    }
    if (isNumeric(value[0])){
        return 'The name must not start with numbers';
    }
    if (value.includes('/') || value.includes('#') || value.includes("'")){
        return 'The field must not contain special characters';
    }
}
export const LoginVal = function (value){
    if (!value){
        return 'This field is required';
    }
    if (value.includes('/') || value.includes('#') || value.includes("'")){
        return 'The field must not contain special characters';
    }

}

export const ChangeProfileVal = function (value){
    if (!value){
        return 'This field is required';
    }
    if (value.length>=14){
        return 'Maximum length - 15 characters';
    }
    if (value.includes('/') || value.includes('#') || value.includes("'")){
        return 'The field must not contain special characters';
    }
}
export const ChangeProfileDescVal = function (value=''){
    if (value?.length>=39){
        return 'Maximum length - 40 characters';
    }
    if (value?.includes('/') || value?.includes('#') || value?.includes("'")){
        return 'The field must not contain special characters';
    }
}
export const CreateRoomVal = function (value){
    if (!value){
        return 'This field is required';
    }
    if (value.length>=9){
        return 'Maximum length - 10 characters';
    }
    if (value.includes('/') || value.includes('#') || value.includes("'")){
        return 'The field must not contain special characters';
    }
}