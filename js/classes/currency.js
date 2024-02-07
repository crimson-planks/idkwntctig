class Currency {
    /**
     * 
     * @param {{name: string,abbreviation: string, get: Function,set: Function}} props 
     */
    constructor(props){
        this.name = props.name;
        this.abbreviation = props.abbreviation;
        this.get = props.get;
        this.set = props.set;
    }
    spend(amount){
        this.set(this.get().minus(amount));
    }
}
var currencies = {
    matter: new Currency({
        name: "matter",
        abbreviation: "MT",
        get: function(){
            return game.matter;
        },
        set: function(value){
            game.matter=new Decimal(value);
        }
    }),
    overflow: new Currency({
        name: "overflow",
        abbreviation: "OP",
        get: function(){
            return game.overflowPoint;
        },
        set: function(value){
            game.overflowPoint=new Decimal(value);
        }
    })
}