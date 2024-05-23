
/** Class representing an upgrade*/
class Upgrade {
    /**
     * 
     * @param {{type: string, id: string, amount: Decimal, cost: Cost, value: Decimal, computedValue: Decimal}} props 
     */
    constructor(props) {
        this.type = props.type;
        this.id = props.id;
        this.amount = props.amount ?? new Decimal();
        this.cost = props.cost;
        //this.costIncrease = props.costIncrease;
        this.value = props.value
        this.computedValue = props.computedValue;
    }
    GetBuyCost(amount){
        return this.cost.GetBuyCost(amount);
    }
    GetMaxBuy(){
        return this.cost.GetMaxBuy();
    }
    CanBuyOnce() {
        return this.cost.CanBuy(1);
    }
    CanBuy(amount) {
        return this.cost.CanBuy(amount);
    }
    SyncAmount() {
        this.cost.boughtAmount = this.amount;
        this.cost.UpdateCost();
    }
    UpdateValue() {
        if(this.type==="overflow"){
            switch(this.id){
                case "startMatter":
                    this.value = this.amount;
                    if(this.value.eq(0)) this.computedValue=Decimal.dZero;
                    else this.computedValue = D(50).mul(Decimal.dTwo.pow(this.value));
                    break;
                case "halveIntervalDivider":
                    this.value = this.amount.mul(0.1);
                    this.computedValue = this.value;
                    UpdateDependentVariables();
                    break;
                case "overflowTimeMultiplier":
                    this.value = this.amount;
                    if(game.statistics.fastestOverflowTime===0) {
                        this.computedValue = new Decimal(1e7);
                        break;
                    }
                    this.computedValue = this.value.mul(Decimal.div(1e7,Decimal.add(1e4,game.statistics.fastestOverflowTime))).ceil();
                    break;
                case "deflationPowerExponent":
                    this.value = this.amount.mul(0.1);
                    this.computedValue = this.value;
                    UpdateDependentVariables();
                    break;
                case "startIntervalReducer":
                    this.value = this.amount.div(8);
                    if(this.value.eq(0)) this.computedValue=new Decimal(1);
                    else this.computedValue = Decimal.pow(2,Decimal.div(new Decimal(1).add(this.value),Decimal.max(Decimal.recip(4),Decimal.div(variables.overflowTime,1000).sub(1).div(64).div(this.value).add(Decimal.div(1,4)))));
                    break;
            }
        }
    }
    BuyForced(amount){
        this.cost.BuyForced(amount);
        this.amount = this.amount.add(amount);
        this.UpdateValue();
    }
    BuyOnceForced() {
        this.BuyForced(1);
    }
    Buy(amount) {
        if(!this.CanBuy(amount)) return false;
        this.BuyForced(amount);
        return true;
    }
    BuyOnce() {
        return this.Buy(1);
    }
    BuyMax(){
        this.Buy(this.GetMaxBuy());
    }
    toStringifiableObject() {
        return {
            _type: "Upgrade",
            type: this.type,
            id: this.id,
            amount: this.amount,
            cost: this.cost.clone(),
            value: this.value,
            computedValue: this.computedValue,
        }
    }
    clone(){
        return new Upgrade({
            type: this.type,
            id: this.id,
            amount: this.amount,
            cost: this.cost,
            value: this.value,
            computedValue: this.computedValue,
        });
    }
    copy(){
        return this.clone();
    }
}
const UpgradeComponent = {
    props: {
        id: Number
    },
    created(){
        
    },
    computed: {

    }
}
var upgradeObject = {
    overflow:{
        startMatter: new Upgrade({
            type: "overflow",
            id: "startMatter",
            amount: new Decimal(),
            cost: new ExponentialCost({
                currencyType: "overflow",
                baseCost: new Decimal(2),
                costIncrease: new Decimal(2),
                maxPossibleBuy: Decimal.dTen,
            }),
            value: new Decimal(),
        }),
        overflowTimeMultiplier: new Upgrade({
            type: "overflow",
            id: "overflowTimeMultiplier",
            amount: new Decimal(),
            cost: new LinearCost({
                currencyType: "overflow",
                baseCost: new Decimal(1),
                costIncrease: new Decimal(),
                maxPossibleBuy: new Decimal(1),
            }),
            value: new Decimal(),
        }),
        halveIntervalDivider: new Upgrade({
            type: "overflow",
            id: "halveIntervalDivider",
            amount: new Decimal(),
            cost: new ExponentialCost({
                currencyType: "overflow",
                baseCost: new Decimal(1),
                costIncrease: new Decimal(10),
                maxPossibleBuy: new Decimal(20),
            })
        }),
        startIntervalReducer: new Upgrade({
            type: "overflow",
            id: "startIntervalReducer",
            amount: new Decimal(),
            cost: new ExponentialCost({
                currencyType: "overflow",
                baseCost: new Decimal(13),
                costIncrease: new Decimal(7),
                maxPossibleBuy: new Decimal(16),
            }),
            value: new Decimal(),
        }),
        deflationPowerExponent: new Upgrade({
            type: "overflow",
            id: "deflationPowerExponent",
            amount: new Decimal(),
            cost: new ExponentialCost({
                currencyType: "overflow",
                baseCost: new Decimal(1),
                costIncrease: new Decimal(5),
                maxPossibleBuy: new Decimal(5),
            }),
            value: new Decimal(),
        })
    }
}