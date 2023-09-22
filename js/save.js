function load(){

}
function internal_ConvertToStringifiableObject(object){
    if(object===null) return object
    if(object===undefined) return {_type: "undefined"}
    if(object===Infinity) return {_type: "Infinity"}
    if(typeof object==="number"&&isNaN(object)) return {_type: "NaN"}
    if(["boolean","number","string"].includes(typeof object)){
        return object;
    }
    if(typeof object==="bigint") return {_type: "bigint" ,_data: object.toString()};
    if(typeof object==="function") return {_type: "function", _data: object.toString()};
    if(object instanceof Decimal){
        return {_type: "Decimal", sign: object.sign, mag: object.mag, layer: object.layer}
    }
    if(object instanceof Autobuyer){
        return object.toStringifiableObject()
    }
    if(object instanceof Array){
        return object.map(internal_ConvertToStringifiableObject)
    }
    if(object instanceof Object){
        for(let element in object){
            object[element] = internal_ConvertToStringifiableObject(object[element])
        }
        return object
    }
    return object
}
function ConvertToStringifiableObject(object){
    if(object instanceof Array) return internal_ConvertToStringifiableObject(ConvertToStringifiableObject(object.map([],object)))
    if(object instanceof Object) return internal_ConvertToStringifiableObject($.extend({}, object))
    return internal_ConvertToStringifiableObject(object)
}
function internal_ConvertToUsableObject(object){
    if(object._type === "undefined") return undefined;
    if(object._type === "Infinity") return Infinity;
    if(object._type === "NaN") return NaN;
    if(object._type === "bigint") return BigInt(object._data)
    if(object._type === "function") return Function(object._data)
    if(object._type === "Decimal") return Decimal.fromComponents(object.sign,object.layer,object.mag)
    if(object instanceof Array) return object.map(internal_ConvertToObject)
    if(object instanceof Object){
        for(let element in object){
            object[element] = internal_ConvertToUsableObject(object[element])
        }
        return object
    }
    return object
}
function ConvertToUsableObject(stringifiableObject){
    return internal_ConvertToUsableObject(stringifiableObject)
}
function save(){
    console.log(ConvertToStringifiableObject(game))
}