
function internal_ConvertToStringifiableObject(object){
    if(object===null) return object
    if(object===undefined) return {_type: "undefined"}
    if(object===Infinity) return {_type: "Infinity"}
    if(typeof object==="number"&&isNaN(object)) return {_type: "NaN"}
    if(["boolean","number","string"].includes(typeof object)){
        return object;
    }
    if(typeof object==="bigint") return {_type: "bigint" ,_data: object.toString()};
    //console.log("pass bigint")
    //console.log(typeof object)
    if(typeof object==="function") return {_type: "function", _data: object.toString()};
    //console.log("pass function")
    if(object instanceof Decimal){
        //console.log(object)
        return {
            _type: "Decimal", 
            sign: internal_ConvertToStringifiableObject(object.sign), 
            mag: internal_ConvertToStringifiableObject(object.mag), 
            layer: internal_ConvertToStringifiableObject(object.layer)}
    }
    if(object instanceof Autobuyer){
        return internal_ConvertToStringifiableObject(object.toStringifiableObject());
    }
    if(object instanceof Upgrade){
        return internal_ConvertToStringifiableObject(object.toStringifiableObject());
    }
    if(object instanceof Array){
        return object.map(ConvertToStringifiableObject)
    }
    if(object instanceof Function){
        return {_type: "f", _data: object.toString()}
    }
    if(object instanceof Object){
        let newObject = {}
        for(let element in object){
            newObject[element] = ConvertToStringifiableObject(object[element])
        }
        return newObject
    }
    return object
}
function ConvertToStringifiableObject(object){
    //if(object instanceof Array) return internal_ConvertToStringifiableObject(object.map(ConvertToStringifiableObject))
    //if(typeof object === "object") return internal_ConvertToStringifiableObject($.extend({}, object))
    return internal_ConvertToStringifiableObject(object)
}
function internal_ConvertToUsableObject(object){
    //console.log(object)
    if(object._type === "undefined") return undefined;
    if(object._type === "Infinity") return Infinity;
    if(object._type === "NaN") return NaN;
    if(object._type === "bigint") return BigInt(object._data)
    if(object._type === "function") return Function("return "+object._data)()
    if(object._type === "Decimal") return Decimal.fromComponents(
        internal_ConvertToUsableObject(object.sign),
        internal_ConvertToUsableObject(object.layer),
        internal_ConvertToUsableObject(object.mag)
        );
    if(object instanceof Array) return object.map(internal_ConvertToUsableObject)
    if(object instanceof Object){
        let newObject = {};
        for(let element in object){
            newObject[element] = internal_ConvertToUsableObject(object[element])
        }
        if(object._type === "Autobuyer"){
            return new Autobuyer(newObject)
        }
        if(object._type === "Upgrade") return new Upgrade(newObject)
        return newObject
    }

    return object
}
function ConvertToUsableObject(stringifiableObject){
    return internal_ConvertToUsableObject(stringifiableObject);
}
function merge_deep(a,b){
    //merge b into a
    if(a?.constructor !== Object) return b;
    Object.keys(b).forEach((index)=>{
        a[index]=merge_deep(a[index],b[index]);
    });
    return a;
}
function load(){
    let loadedGame={};
    try{
        loadedGame = ConvertToUsableObject(JSON.parse(localStorage.getItem("FalseInfinitySave")));
    }
    catch(SyntaxError){
        loadedGame={};
    }
    //console.log(loadedGame);
    //console.log(defaultGame);
    let merged_obj = merge_deep({},defaultGame);
    merged_obj = merge_deep(merged_obj,loadedGame);
    //game = $.extend({},defaultGame,loadedGame);
    game = merged_obj;
    //console.log(game)
    appThis.Update();
}
function save(){
    localStorage.setItem("FalseInfinitySave",JSON.stringify(ConvertToStringifiableObject(game)))
    game.lastSaved = Date.now();
}