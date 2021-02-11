import base_avatar from "./source/base_avatar.jpg";

export function includeImage(path : string | null,default_image = base_avatar){
    let src;
    if (path) {
        try {
            src = require(`./../../backend/${path}`);
        } catch (error) {
            console.log('error');
        }
    }
    let isSrc = path && src ? src.default : default_image;
    return isSrc
}

export const catchFile = (callback : Function) => {
    return (event : any) => {
        if (event.target.files.length>0){
            callback(event.target.files[0])
        }
    }
}
export const checkVideoUrl = (url : string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
        return true;
    } else {
        return false
    }
}
export const iconStyle = function(fontSize=50, svg_color='white'){
    return {fontSize: 50,color : svg_color}
}
export const сutWord = function(word : string | null, length : number){
    if (!word){
        return null
    }
    return word.length>length ? word.slice(0,length)+'...' : word
}
export const isWrong = (value : string | null) => {
    if (!value || value.includes('/') || value.includes('#') || value.includes("'") ||
        value.length>200){
        return true
    }
    return false
}
export const isNull = (value : any) =>{
    if (value=='null' || value=='undefined' || !value){
        return true
    }
    return false
}