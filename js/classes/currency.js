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
    produce(amount){
        this.set(this.get().add(amount))
    }
}
var currencies = {
    matter: new Currency({
        name: "matter",
        abbreviation: "MT",
        get(){
            return game.matter;
        },
        set(value){
            game.matter=D(value);
        }
    }),
    deflationPower: new Currency({
        name: "deflation power",
        abbreviation: "DPW",
        get(){
            return game.deflationPower;
        },
        set(value){
            game.deflationPower=D(value);
        }
    }),
    deflator: new Currency({
        name: "deflator",
        abbreviation: "DF",
        get(){
            return game.deflator;
        },
        set(value){
            game.deflator = D(value);
        }
    }),
    overflow: new Currency({
        name: "overflow points",
        abbreviation: "[redacted]",
        get(){
            return game.overflowPoint;
        },
        set(value){
            game.overflowPoint=D(value);
        }
    }),
    energy: new Currency({
        name: "joules",
        "abbreviation": "J",
        get(){
            return game.energy;
        },
        set(value){
            game.energy=D(value);
        }
    })
}