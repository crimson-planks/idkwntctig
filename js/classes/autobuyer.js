/**
 * class representing an autobuyer
 */
class Autobuyer{
    /**
     * 
     * @param {{cost: Cost,
     *          intervalCost: Cost}} props 
     */
    constructor(props){
        this.type = props.type
        this.tier = props.tier;
        this.initialInterval = new Decimal(props.initialInterval);
        this.interval = new Decimal(props.interval ?? props.initialInterval);
        this.intervalByType = props.intervalByType ?? {};
        this.cost = props.cost;
        this.amount = new Decimal(props.amount);
        this.amountByType = props.amountByType ?? {};
        this.intervalCost = props.intervalCost;
        this.intervalCostIncrease= new Decimal(props.intervalCostIncrease);
        this.active = props.active ?? true;
        this.option = props.option ?? {};

        //time in milliseconds
        this.timer = props.timer?props.timer:0;
    }
    GetBuyCost(amount){
        return this.cost.GetBuyCost(amount);
    }
    CanBuy(amount){
        return this.cost.CanBuy(amount);
    }
    CanBuyInterval(amount){
        return this.intervalCost.CanBuy(amount);
    }
    getPerSecond(){
        let result=this.amount.mul(1000).div(this.interval);
        if(this.type==="matter"&&this.tier===0) return result.mul(game.clickGain);
        return result
    }
    getLosePerSecond(){
        if(this.tier==0) return new Decimal(0);
        if(this.type==="overflow" && this.tier==="metaBuy"){
            return game?.autobuyerObject?.matter[this.option.buyId]?.GetBuyCost(this.getPerSecond()) ?? D(0);
        }
        return game.autobuyerObject.matter[this.tier-1].GetBuyCost(this.getPerSecond());
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
    UpdateInterval(){
        let tmp=new Decimal(this.initialInterval);
        Object.keys(this.intervalByType).forEach((value)=>{
            tmp=tmp.mul(this.intervalByType[value]);
        });
        this.interval=tmp;
        return tmp;
    }
    GetMaxBuy(){
        return this.cost.GetMaxBuy();
    }
    GetMaxBuyInterval(){
        return this.intervalCost.GetMaxBuy();
    }
    BuyOnce(type = "normal"){
        return this.Buy(1,type);
    }
    BuyForced(amount, type="normal"){
        this.cost.BuyForced(amount);
        this.amountByType[type] = (this.amountByType[type] ?? D(0))
                                   .add(amount);
        this.UpdateAmount();
    }
    BuyStrict(amount, type="normal"){
        if(!this.CanBuy(amount)) return false;
        this.BuyForced(amount, type);
        return true;
    }
    Buy(amount, type = "normal"){
        const buyAmount = this.cost.GetPossibleBuyAmount(amount);
        //console.log(`buyAmount: ${buyAmount}`)
        if(buyAmount.lt(1)) return false;
        return this.BuyStrict(buyAmount, type);
    }
    getIntervalCost(amount){
        return this.intervalCost.GetBuyCost(amount);
    }
    UpdateNormalInterval(){
        if(this.type==="matter") this.intervalByType.normal = Decimal.pow(variables.intervalDivide,this.intervalCost.boughtAmount).recip();
        else this.intervalByType.normal = Decimal.pow(2,this.intervalCost.boughtAmount).recip();
    }
    BuyInterval(amount){
        const buyAmount = this.intervalCost.GetPossibleBuyAmount(amount);
        if(!this.intervalCost.Buy(amount)) return false;
        //this.intervalByType.normal = (this.intervalByType.normal ?? new Decimal(1))
        //                              .div(Decimal.pow(2,buyAmount));
        this.UpdateNormalInterval();
        this.UpdateInterval();
        UpdateDependentVariables();
        return true;
    }
    BuyMaxInterval(){
        this.BuyInterval(this.GetMaxBuyInterval());
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
                game.autobuyerObject.matter[this.tier-1].Buy(this.amount.mul(amount));
            }
        }
        if(this.type==="deflation"){
            if(this.tier===0){
                GainDeflationPower(this.amount.mul(amount));
                UpdateDependentVariables();
            }
        }
        if(this.type==="overflow"){
            if(this.tier==="metaBuy"){
                game.autobuyerObject.matter[this.option.buyId]?.Buy(this.amount.mul(amount));
            }
            if(this.tier==="intervalBuy"){
                game.autobuyerObject.matter.forEach((autobuyer)=>{
                    autobuyer.BuyMaxInterval();
                });
            }
        }
    }
    Loop(){
        this.UpdateInterval();
        if(!this.active) return;
        if(this.amount<=new Decimal(0)) return;
        this.timer+=Date.now()-game.lastUpdated;
        if(D(this.timer).gte(this.interval)){
            let amount = Decimal.floor(Decimal.div(this.timer,this.interval));
            this.timer = D(this.timer).mod(this.interval).toNumber();
            
            this.AutoBuy(amount);
            appThis.Update();
        }
    }
    clone(){
        return new Autobuyer({
            type: this.type,
            tier: this.tier,
            initialInterval: this.initialInterval,
            interval: this.interval,
            intervalByType: jQuery.extend({},this.intervalByType),
            cost: this.cost.clone(),
            amount: this.amount,
            amountByType: jQuery.extend({},this.amountByType),
            intervalCost: this.intervalCost.clone(),
            active: this.active,
            option: jQuery.extend({},this.option),
        });
    }
    toStringifiableObject(){
        return {
            _type: "Autobuyer",
            type: this.type,
            tier: this.tier,
            initialInterval: this.initialInterval,
            interval: new Decimal(this.interval),
            intervalByType: this.intervalByType,
            cost: this.cost,
            amount: new Decimal(this.amount),
            amountByType: this.amountByType,
            intervalCost: this.intervalCost,
            active: this.active,
            option: this.option,
        }
    }
}

const AutobuyerComponent = {
    data(){
        return {
            visual: {
                interval_buy: {
                    vue_class: {
                        "can-buy-button": {

                        },
                        "cannot-buy-button": {
                            
                        }
                    }
                },
                buy: {
                    vue_class: {
                        "can-buy-button": {

                        },
                        "cannot-buy-button": {
                            
                        }
                    }
                },
                cost: "",
                interval: "",
                amount: "",
                showExtraAmount: false,
                extraAmount: "",
                intervalCost: "",
                active: true,
                name: ""
            }
        };
    },
    props: ['initobject','type','tier'],
    created(){
        this.object = this.initobject;
        bus.autobuyer[this.object.type] = bus.autobuyer[this.object.type] ?? {};
        bus.autobuyer[this.object.type][this.object.tier] = this;
        //console.log(`Autobuyer type: ${this.type}, tier:  ${this.tier}`)
        this.Update();
    },
    template: `
    <div class="autobuyer-div unselectable">
        <h4 class="autobuyer-name-div center">{{visual.name}}</h4>
        <span class="autobuyer-text-div">Amount: {{visual.amount}} <span v-if="visual.showExtraAmount">+ {{visual.extraAmount}}</span></span>
        <span class="autobuyer-text-div autobuyer-button autobuyer-buy-button pointer-cursor" :class="visual.buy.vue_class" v-on:click="ClickBuyButton()">Cost: {{visual.cost}}</span>
        <span class="autobuyer-text-div">Interval:&nbsp;{{visual.interval}} ms</span>
        <span class="autobuyer-text-div autobuyer-button pointer-cursor" :class="visual.interval_buy.vue_class" v-on:click="ClickIntervalBuyButton()">Interval Cost: {{visual.intervalCost}}</span>
        <span class="autobuyer-text-div autobuyer-button pointer-cursor" v-on:click="ClickToggleButton()"> Toggle: {{visual.active}}</span>
        <span v-if="false"></span>
    </div>
    `,
    methods: {
        UpdateObject(){
            this.object = game.autobuyerObject[this.type][this.tier];
        },
        Update(){
            //console.log("autobuyer update")
            this.UpdateObject();
            if(this.object===undefined) return;

            this.visual.buy.vue_class["can-buy-button"] = this.object.CanBuy(1);
            this.visual.buy.vue_class["cannot-buy-button"] = !this.object.CanBuy(1);
            this.visual.interval_buy.vue_class["can-buy-button"] = this.object.CanBuyInterval(1);
            this.visual.interval_buy.vue_class["cannot-buy-button"] = !this.object.CanBuyInterval(1);
            
            this.visual.cost=FormatValue(this.object.cost.cost)+" "+currencies[this.object.cost.currencyType].abbreviation;
            this.visual.interval=FormatValue(this.object.interval);
            this.visual.amount=FormatValue(this.object.amountByType["normal"], {smallDec: 0});
            let showExtraAmount = true;
            if(!this.object.amountByType["startAutoclicker"]) showExtraAmount = false;
            else if(this.object.amountByType["startAutoclicker"].eq(0)) showExtraAmount = false;
            this.visual.showExtraAmount=showExtraAmount;
            this.visual.extraAmount=FormatValue(this.object.amountByType["startAutoclicker"] ?? 0, {smallDec: 0});
            this.visual.intervalCost=FormatValue(this.object.intervalCost.cost)+" "+currencies[this.object.intervalCost.currencyType].abbreviation;
            //console.log(this.object.active);
            this.visual.active=String(this.object.active);
            this.visual.name= (this.object.tier===0) ? "Autoclicker" : "Autobuyer "+String(this.object.tier);
        },
        ClickBuyButton(){
            this.object.BuyOnce();
            appThis.Update();
        },
        ClickIntervalBuyButton(){
            this.object.BuyInterval(1);
            appThis.Update();
        },
        ClickToggleButton(){
            this.object.Toggle();
            appThis.Update();
        }
    }
}
var autobuyerObject={
    matter: [
        new Autobuyer({
            type: "matter",
            tier: 0,
            initialInterval: 1000,
            cost: new LinearCost({
                currencyType: "matter",
                baseCost: new Decimal(10),
                costIncrease: new Decimal(5)
            }),
            intervalCost: new ExponentialCost({
                currencyType: "matter",
                baseCost: new Decimal(100),
                costIncrease: new Decimal(10)
            }),
            active: true
        }),
        new Autobuyer({
            type: "matter",
            tier: 1,
            initialInterval: 2000,
            cost: new LinearCost({
                currencyType: "matter",
                baseCost: new Decimal(500),
                costIncrease: new Decimal(100)
            }),
            intervalCost: new ExponentialCost({
                currencyType: "matter",
                baseCost: new Decimal(1000),
                costIncrease: new Decimal(100)
            }),
            active: true
        }),
        new Autobuyer({
            type: "matter",
            tier: 2,
            initialInterval: 4000,
            cost: new LinearCost({
                currencyType: "matter",
                baseCost: new Decimal("1e7"),
                costIncrease: new Decimal("1e6")
            }),
            intervalCost: new ExponentialCost({
                currencyType: "matter",
                baseCost: new Decimal("1e8"),
                costIncrease: new Decimal("1000")
            }),
            active: true
        })
    ],
    deflation: [
        new Autobuyer({
            type: "deflation",
            tier: 0,
            initialInterval: 500,
            cost: new ConstantCost({
                currencyType: "deflator",
                baseCost: new Decimal(1),
                costIncrease: new Decimal(0),
            }),
            intervalCost: new ExponentialCost({
                currencyType: "deflator",
                baseCost: new Decimal(1),
                costIncrease: new Decimal(2)
            })
        })
    ],
    overflow: {
        metaBuy: new Autobuyer({
            type: "overflow",
            tier: "metaBuy",
            initialInterval: 1000,
            cost: new LinearCost({
                currencyType: "overflow",
                baseCost: new Decimal("1000"),
                costIncrease: new Decimal("1000")
            }),
            intervalCost: new ExponentialCost({
                currencyType: "overflow",
                baseCost: new Decimal("10000"),
                costIncrease: new Decimal("10")
            }),
            option: {
                buyId: 0
            },
            active: true
        }),
        intervalBuy: new Autobuyer({
            type: "overflow",
            tier: "intervalBuy",
            initialInterval: 1000,
            cost: new LinearCost({
                currencyType: "overflow",
                baseCost: new Decimal("1000"),
                costIncrease: new Decimal("1000")
            }),
            intervalCost: new ExponentialCost({
                currencyType: "overflow",
                baseCost: new Decimal("10000"),
                costIncrease: new Decimal("10")
            }),
            active: true
        })
    }
};