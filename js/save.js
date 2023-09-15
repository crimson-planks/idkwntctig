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
    if(object instanceof Array){
        return object.map(internal_ConvertToStringifiableObject)
    }
    if(object instanceof Object){
        for(let element in object){
            object[element] = internal_ConvertToStringifiableObject(object[element])
        }
        return object
    }
}
function ConvertToStringifiableObject(object){
    if(object instanceof Array) return internal_ConvertToStringifiableObject(ConvertToStringifiableObject(object.map([],object)))
    if(object instanceof Object) return internal_ConvertToStringifiableObject($.extend({}, object))
    return internal_ConvertToStringifiableObject(object)
}
function ConvertToObject(stringifiableObject){

}
function save(){
    console.log(game)
}