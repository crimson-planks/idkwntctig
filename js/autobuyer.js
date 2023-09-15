class Autobuyer{
    constructor(props){
        this.type = props.type
        this.tier = props.tier;
        this.interval = new Decimal(props.interval);
        this.cost = new Decimal(props.cost);
        this.amount = new Decimal(props.amount);
        this.bought = new Decimal(props.bought);
        this.costIncrease = new Decimal(props.costIncrease);
        this.intervalCost = new Decimal(props.intervalCost);
        this.intervalCostIncrease= new Decimal(props.intervalCostIncrease);
        this.active = props.active;
        if(this.active===undefined) this.active=true

        //time in milliseconds
        this.timer = 0;
    }
    CanAutoBuy(amount){
        if(this.type===0){
            if(this.tier===0){
                return true;
            }
            else{
                return game.autobuyerArray[this.tier-1].CanBuy(amount);
            }
        }
        return false;
    }
    get CanBuyOnce(){
        return CanBuy(this.cost, game.matter);
    }
    GetBuyCost(amount){
        return this.cost.mul(amount).plus(this.costIncrease.mul(amount).div(2).mul(Decimal.sub(amount,1)));
    }
    CanBuy(amount){
        return CanBuy(this.GetBuyCost(amount), game.matter);
    }
    CanBuyInterval(amount){
        return ci.sumOfExponential()
    }
    get getPerSecond(){
        return this.amount.mul(1000).div(this.interval);
    }
    get LosePerSecond(){
        return new Decimal(0);
    }
    GetMaxBuy(money){
        //quadratic formula breaks when costIncrease==0
        if(this.costIncrease.eq(0)&&this.cost.gt(0)) return money.div(this.cost).floor()
        if(this.costIncrease.lte(0)&&this.cost.lte(0)) return Decimal.dInf;
        let a = this.costIncrease.div(2);
        let b = this.cost.sub(a);
        let c = Decimal.neg(money);
        //quadratic formula
        return Decimal.neg(b).add(b.pow(2).sub(a.mul(c).mul(4)).pow(0.5)).div(this.costIncrease).floor();
    }
    BuyOnce(){
        if(!this.CanBuyOnce) return false;
        game.matter=game.matter.minus(this.cost);
        this.cost=this.cost.add(this.costIncrease);
        this.amount=this.amount.add(1);
        return true;
    }
    Buy(amount){
        const maxBuy = this.GetMaxBuy(game.matter);
        if(maxBuy.lt(1)) return false;
        const buyAmount = Decimal.min(amount,maxBuy);
        game.matter=game.matter.minus(this.GetBuyCost(buyAmount));
        this.cost=this.cost.add(this.costIncrease.mul(buyAmount));
        this.amount=this.amount.add(buyAmount);
        return true;
    }
    getBuyIntervalCost(amount){
        return ci.sumOfExponential(this.intervalCost,this.intervalCostIncrease,amount);
    }
    BuyInterval(amount){
        const maxAmount = ci.inverseSumOfExponential(this.intervalCost,this.intervalCostIncrease, game.matter).floor();
        const buyAmount = Decimal.min(maxAmount,amount);
        let cost = this.getBuyIntervalCost(buyAmount)
        if(cost.gt(game.matter)) return;
        game.matter=game.matter.minus(this.getBuyIntervalCost(buyAmount))
        this.intervalCost=this.intervalCost.mul(this.intervalCostIncrease.pow(buyAmount))
        this.interval=this.interval.div(Decimal.pow(1.5,buyAmount))
        
    }
    Toggle(){
        this.active=!this.active
    }
    AutoBuy(amount){
        if(this.type===0){
            if(this.tier===0){
                ClickGainMoney(this.amount.mul(amount));
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
            bought: this.bought,
            costIncrease: this.costIncrease,
            intervalCost: this.intervalCost,
            intervalCostIncrease: this.intervalCostIncrease,
            active: this.active
        });
    }
}