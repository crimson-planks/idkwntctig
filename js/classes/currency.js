class Currency {
    /**
     * 
     * @param {{displayName: string,abbreviation: string, get: Function, set: Function, spend: Function, produce: Function}} props 
     */
    constructor(props){
        this.name = props.name;
        this.displayName = props.displayName;
        this.abbreviation = props.abbreviation;
        this.get = props.get;
        this.set = props.set;
        this.spendExtra = props.spendExtra ?? ((amount)=>{});
        this.produceExtra = props.produceExtra ?? ((amount)=>{});
    }
    spend(amount){
        this.set(this.get().minus(amount));
        this.spendExtra(amount);
    }
    produce(amount){
        this.set(this.get().add(amount));
        this.produceExtra(amount);
    }
}
var currencies = {
    dev: new Currency({
        name: "dev",
        displayName: "dev currency",
        abbreviation: "DEV",
        get(){
            return dev.currency;
        },
        set(value){
            dev.currency=D(value);
        }
    }),
    matter: new Currency({
        displayName: "matter",
        abbreviation: "MT",
        get(){
            return game.matter;
        },
        set(value){
            game.matter=D(value);
        },
        produceExtra(amount){
            game.statistics.matterProduced=game.statistics.matterProduced.add(amount);
        }
    }),
    deflationPower: new Currency({
        displayName: "deflation power",
        abbreviation: "DPW",
        get(){
            return game.deflationPower;
        },
        set(value){
            game.deflationPower=D(value);
        }
    }),
    deflator: new Currency({
        displayName: "deflator",
        abbreviation: "DF",
        get(){
            return game.deflator;
        },
        set(value){
            game.deflator = D(value);
        }
    }),
    overflow: new Currency({
        displayName: "overflow points",
        abbreviation: "OP",
        get(){
            return game.overflowPoint;
        },
        set(value){
            game.overflowPoint=D(value);
        }
    }),
    energy: new Currency({
        displayName: "joules",
        "abbreviation": "J",
        get(){
            return game.energy;
        },
        set(value){
            game.energy=D(value);
        }
    })
}