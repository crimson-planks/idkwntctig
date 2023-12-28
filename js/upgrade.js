/** Class representing an upgrade*/
class Upgrade {
    /**
     * 
     * @param {{type: string, id: string, amount: Decimal, cost: Decimal, costIncrease: Decimal, value: Decimal}} props 
     */
    constructor(props) {
        this.type = props.type;
        this.id = props.id;
        this.amount = props.amount ?? new Decimal();
        this.cost = props.cost;
        this.costIncrease = props.costIncrease;
        this.value = props.value
        this.computedValue = props.computedValue;
    }
    GetCostForMultipleBuys(amount){
        return costIncrease.sumOfLinear(this.cost,this.costIncrease,amount);
    }
    CanBuyOnce(money) {
        return this.cost.lte(money)
    }
    CanBuy(amount,money) {
        return this.GetCostForMultipleBuys(amount).lte(money)
    }
    UpdateAmount() {
        throw "NotImplemented"
    }
    UpdateValue() {
        if(this.type==="overflow"){
            if(this.id==="matterPerClick") {
                this.value = this.amount;
                this.computedValue = this.value;
            }
            if(this.id==="startAutoclicker") {
                this.value = this.amount.mul(10);
                this.computedValue = this.value.mul(game.overflowPoint.add(1));
            }
            if(this.id==="overflowTimeMultiplier") {
                this.value = this.amount;
                this.computedValue = Decimal.div(360,this.value);
            }
        }
    }
    BuyOnceForced() {
        this.amount = this.amount.add(1);

        this.UpdateValue();

        if(this.type==="matter") game.matter = game.matter.sub(this.cost);
        if(this.type==="overflow") game.overflowPoint = game.overflowPoint.sub(this.cost);
        if(this.type==="infinity");

        this.cost = this.cost.add(this.costIncrease);
    }
    BuyOnce() {
        //validation
        let currency;
        if(this.type==="matter") currency = game.matter;
        if(this.type==="overflow") currency = game.overflowPoint;
        if(this.type==="infinity");
        if(!this.CanBuyOnce(currency)) return false;
        this.BuyOnceForced();
        return true;
        
    }
    BuyForced(amount){
        this.amount = this.amount.add(amount)

        this.UpdateValue();
        if(this.type==="matter") game.matter = game.matter.sub(this.GetCostForMultipleBuys(amount));
        if(this.type==="overflow") game.overflowPoint = game.overflowPoint.sub(this.GetCostForMultipleBuys(amount));
        if(this.type==="infinity");
        this.cost = this.cost.add(this.costIncrease.mul(amount));
    }
    Buy(amount) {
        let currency = new Decimal();
        if(this.type==="matter") currency = game.matter;
        if(this.type==="overflow") currency = game.overflowPoint;
        if(this.type==="infinity");
        if(!this.CanBuy(amount,currency)) return false;
        this.BuyForced(amount);
        return true;
    }
    BuyMax(amount=Decimal.dInf){
        this.Buy(this.GetCostForMultipleBuys(amount))
    }
    toStringifiableObject() {
        return {
            _type: "Upgrade",
            type: this.type,
            id: this.id,
            amount: this.amount,
            cost: this.cost,
            costIncrease: this.costIncrease,
            value: this.value,
            computedValue: this.computedValue
        }
    }
    clone(){
        return new Upgrade(this.toStringifiableObject());
    }
    copy(){
        return this.clone();
    }
}