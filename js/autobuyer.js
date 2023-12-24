/**
 * class representing an autobuyer
 */
class Autobuyer{
    constructor(props){
        this.type = props.type
        this.tier = props.tier;
        this.interval = new Decimal(props.interval);
        this.cost = new Decimal(props.cost);
        this.amount = new Decimal(props.amount);
        this.amountByType = props.amountByType ?? {};
        this.costIncrease = new Decimal(props.costIncrease);
        this.intervalCost = new Decimal(props.intervalCost);
        this.intervalCostIncrease= new Decimal(props.intervalCostIncrease);
        this.active = props.active;
        if(this.active===undefined) this.active=true

        //time in milliseconds
        this.timer = props.timer?props.timer:0;
    }
    CanAutoBuy(amount){
        if(this.type==="matter"){
            if(this.tier===0){
                return true;
            }
            else{
                return game.autobuyerArray[this.tier-1].CanBuy(amount);
            }
        }
        return false;
    }
    GetBuyCost(amount){
        return this.cost.mul(amount).plus(this.costIncrease.mul(amount).div(2).mul(Decimal.sub(amount,1)));
    }
    CanBuyOnce(){
        return CanBuy(this.cost, game.matter);
    }
    CanBuy(amount){
        return CanBuy(this.GetBuyCost(amount), game.matter);
    }
    CanBuyIntervalOnce(){
        return CanBuy(this.intervalCost,game.matter);
    }
    CanBuyInterval(amount){
        return costIncrease.sumOfExponential();
    }
    getPerSecond(){
        let result=this.amount.mul(1000).div(this.interval);
        if(this.type=="matter"&&this.tier==0) return result.mul(game.clickGain);
        return result
    }
    getLosePerSecond(){
        if(this.tier==0) return new Decimal(0);
        return game.autobuyerArray[this.tier-1].GetBuyCost(this.getPerSecond())
        //throw "NotImplemented"
    }
    UpdateAmount(){
        let tmp=new Decimal(0);
        Object.keys(this.amountByType).forEach((value)=>{
            tmp=tmp.add(this.amountByType[value]);
        });
        this.amount=tmp;
        return tmp;
    }
    GetMaxBuy(money){
        //quadratic formula breaks when costIncrease==0
        if(this.costIncrease.eq(0)&&this.cost.gt(0)) return money.div(this.cost).floor();
        if(this.costIncrease.lte(0)&&this.cost.lte(0)) return Decimal.dInf;
        let a = this.costIncrease.div(2);
        let b = this.cost.sub(a);
        let c = Decimal.neg(money);
        //quadratic formula
        return Decimal.neg(b).add(b.pow(2).sub(a.mul(c).mul(4)).pow(0.5)).div(this.costIncrease).floor();
    }
    BuyOnce(type = "normal"){
        if(!this.CanBuyOnce()) return false;
        game.matter=game.matter.minus(this.cost);
        this.cost=this.cost.add(this.costIncrease);
        this.amountByType[type] = (this.amountByType[type] ?? new Decimal(0)).add(1);
        this.UpdateAmount();
        return true;
    }
    //TODO: add ForcedBuy and use Buy as a wrapper function
    Buy(amount, type = "normal"){
        const maxBuy = this.GetMaxBuy(game.matter);
        if(maxBuy.lt(1)) return false;
        const buyAmount = Decimal.min(amount,maxBuy);
        game.matter=game.matter.minus(this.GetBuyCost(buyAmount));
        this.cost=this.cost.add(this.costIncrease.mul(buyAmount));
        this.amountByType[type] = (this.amountByType[type] ?? new Decimal(0)).add(buyAmount);
        this.UpdateAmount();
        return true;
    }
    getBuyIntervalCost(amount){
        return costIncrease.sumOfExponential(this.intervalCost,this.intervalCostIncrease,amount);
    }
    BuyInterval(amount){
        const maxAmount = costIncrease.inverseSumOfExponential(this.intervalCost,this.intervalCostIncrease, game.matter).floor();
        const buyAmount = Decimal.min(maxAmount,amount);
        let cost = this.getBuyIntervalCost(buyAmount)
        if(buyAmount.lte(0)) return false;
        game.matter=game.matter.minus(cost);
        this.intervalCost=this.intervalCost.mul(this.intervalCostIncrease.pow(buyAmount));
        this.interval=this.interval.div(Decimal.pow(2,buyAmount));
        return true;
    }
    Toggle(){
        this.active=!this.active;
    }
    AutoBuy(amount){
        if(this.type==="matter"){
            if(this.tier===0){
                ClickGainMoney(this.amount.mul(amount).mul(game.clickGain));
            } 
            else{
                game.autobuyerArray[this.tier-1].Buy(this.amount.mul(amount));
            }
        }
    }
    Loop(){
        if(!this.active) return;
        if(this.amount<=new Decimal(0)) return;
        this.timer+=Date.now()-game.lastUpdated;
        if(this.timer>=this.interval){
            let amount = Decimal.floor(Decimal.div(this.timer,this.interval));
            this.timer = this.timer%this.interval;
            
            this.AutoBuy(amount);
            appThis.Update();
        }
    }
    clone(){
        return new Autobuyer({
            type: this.type,
            tier: this.tier,
            interval: this.interval,
            cost: this.cost,
            amount: this.amount,
            amountByType: jQuery.extend({},this.amountByType),
            costIncrease: this.costIncrease,
            intervalCost: this.intervalCost,
            intervalCostIncrease: this.intervalCostIncrease,
            active: this.active
        });
    }
    toStringifiableObject(){
        return {
            _type: "Autobuyer",
            type: this.type,
            tier: this.tier,
            interval: new Decimal(this.interval),
            cost: new Decimal(this.cost),
            amount: new Decimal(this.amount),
            amountByType: this.amountByType,
            costIncrease: new Decimal(this.costIncrease),
            intervalCost: new Decimal(this.intervalCost),
            intervalCostIncrease: new Decimal(this.intervalCostIncrease),
            active: this.active
        }
    }
}