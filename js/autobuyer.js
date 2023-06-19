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

        //time in milliseconds
        this.timer = 0;
    }
    get CanAutoBuy(){
        if(this.type===0){
            if(this.tier===0){
                return true;
            }
        }
        return false;
    }
    get CanBuyOnce(){
        return CanBuy(this.cost, game.money);
    }
    GetBuyCost(amount){
        return this.cost.mul(amount).plus(this.costIncrease.mul(amount).div(2).mul(Decimal.sub(amount,1)));
    }
    CanBuy(amount){
        return CanBuy(this.GetBuyCost(amount), game.money);
    }
    get getPerSecond(){
        return this.amount.mul(1000).div(this.interval);
    }
    get LosePerSecond(){
        return new Decimal(0);
    }
    GetMaxAutoBuy(money){
        let a = this.costIncrease.div(2);
        let b = this.cost.sub(a);
        let c = Decimal.neg(money);
        return Decimal.neg(b).add(b.pow(2).sub(a.mul(c).mul(4)).pow(0.5)).div(this.costIncrease).floor();
    }
    BuyOnce(){
        if(!this.CanBuyOnce) return;
        game.money=game.money.minus(this.cost);
        this.cost=this.cost.add(this.costIncrease);
        this.amount=this.amount.add(1);
    }
    Buy(amount){
        if(!this.CanBuy(amount)) return;
    }
    BuyIntervalOnce(){
        
    }
    AutoBuy(amount){
        if(!this.CanAutoBuy) return;
        if(this.type===0){
            if(this.tier===0){
                ClickGainMoney(this.amount.mul(amount));
            }
        }
    }
    Loop(){
        if(this.amount<=new Decimal(0)) return;
        this.timer+=Date.now()-game.lastUpdated;
        if(this.timer>=this.interval){
            let amount = Decimal.floor(Decimal.div(this.timer,this.interval));
            this.timer = this.timer%this.interval;
            this.AutoBuy(amount);
            appThis.Update();
        }
    }
}