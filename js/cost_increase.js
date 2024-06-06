;
/** 
 * object containing various summation functions
*/
var sumFunctions={
    /**
     * sum of f(x) = (increase)(x)+(start) for x where 0<=x<buyAmount
     * @param {Decimal} start
     * @param {Decimal} buyAmount
     * @param {Decimal} increase 
     * @returns {Decimal}
     */
    sumOfLinear(start,increase,buyAmount){
        return new Decimal(0.5).mul(increase).mul(buyAmount).mul(Decimal.add(buyAmount,-1)).add(Decimal.mul(start,buyAmount));
    },
    infiniteExponential(n){
        return Decimal.sub(1,Decimal.recip(n)).recip();
    },
    /**
     * finite geometric series; S(a,r,n) = a + ar + ar^2 + ... + ar^n
     * 
     * @param {Decimal} start 
     * @param {Decimal} increase 
     * @param {Decimal} buyAmount 
     * @returns {Decimal}
     */
    sumOfExponential(start,increase,buyAmount){
        start = new Decimal(start);
        increase = new Decimal(increase);
        buyAmount = new Decimal(buyAmount);
        if(increase.eq(1)) return start.mul(buyAmount);
        return start.mul(increase.pow(buyAmount).sub(1).div(increase.sub(1)));
    },
    /**
     * inverse of sumOfExponential; find n in S(a,r,n) = a + ar + ar^2 + ... + ar^n
     * @param {Decimal} start 
     * @param {Decimal} increase 
     * @param {Decimal} sum 
     * @returns {Decimal}
     */
    inverseSumOfExponential(start,increase,sum){
        //return buyAmount
        start = new Decimal(start);
        increase = new Decimal(increase);
        sum = new Decimal(sum);
        return increase.minus(1).mul(sum).div(start).add(1).log(increase);
    },
}

/** 
 * abstract class for object that deals with cost, cost increase, max buy, etc ... 
 * @constructor
 * @abstract
 * @interface Cost
 */

class Cost{
    constructor(props){
        this.currencyType = props.currencyType;
        this.baseCost = props.baseCost;
        if([undefined,null].includes(this.baseCost)) throw Error("baseCost is undefined or null");
        this.initialCost = props.initialCost ?? props.baseCost;
        this.cost = props.cost ?? this.initialCost;
        this.costIncrease = props.costIncrease;
        this.boughtAmount = props.boughtAmount ?? Decimal.dZero;
        this.maxPossibleBuy = props.maxPossibleBuy ?? Decimal.dInf;
    }
    /** @abstract Get the cost of buying*/
    GetBuyCost_internal(amount){throw "NotImplemented"};
    GetBuyCost(amount){
        const willBuyAmount = this.boughtAmount.add(amount);
        if(willBuyAmount.gt(this.maxPossibleBuy)){return Decimal.dInf}
        return this.GetBuyCost_internal(amount);
    }
    /** @abstract Get the maximum buyable with the currency */
    GetMaxBuy_internal(){throw "NotImplemented"};
    GetMaxBuy(){
        return Decimal.min(this.maxPossibleBuy,this.GetMaxBuy_internal());
    }
    GetIncreasedCost_internal(amount){
        return this.GetCostForBoughtAmount(this.boughtAmount.add(amount))
    }
    GetIncreasedCost(amount){
        const willBuyAmount = this.boughtAmount.add(amount);
        if(willBuyAmount.gt(this.maxPossibleBuy)) return Decimal.dInf;
        return this.GetIncreasedCost_internal(amount);
    }
    /** @abstract Get the next cost when boughtAmount is amount */
    GetCostForBoughtAmount(amount){throw "NotImplemented"}
    UpdateCost(){
        this.cost = this.GetCostForBoughtAmount(this.boughtAmount);
    }
    isBoughtMax(){
        return this.boughtAmount.gte(this.maxPossibleBuy);
    }
    get currency(){
        return currencies[this.currencyType].get();
    }
    set currency(amount){
        currencies[this.currencyType].set(amount);
    }
    SpendCurrency(amount){
        currencies[this.currencyType].spend(amount);
    }
    CanBuy(amount){
        const willBuyAmount = this.boughtAmount.add(amount);
        if(willBuyAmount.gt(this.maxPossibleBuy)) return false;
        return CanBuy(this.GetBuyCost(amount),this.currency);
    }
    IncreaseCost(amount){
        this.cost=this.GetIncreasedCost(amount);
    }
    BuyForced(amount){
        this.SpendCurrency(this.GetBuyCost(amount));
        this.IncreaseCost(amount);
        this.boughtAmount = this.boughtAmount.add(amount);
    }
    BuyStrict(amount){
        if(!this.CanBuy(amount)) return false;
        this.BuyForced(amount);
        return true;
    }
    GetPossibleBuyAmount(amount){
        return Decimal.min(amount,this.GetMaxBuy());
    }
    Buy(amount){
        if(Decimal.eq(amount,1)){
            return this.BuyStrict(amount);
        }
        const buyAmount = this.GetPossibleBuyAmount(amount);
        if(this.GetMaxBuy().lt(1)) return false;
        return this.BuyStrict(buyAmount);
    }
    BuyMax(){
        return this.Buy(this.GetMaxBuy());
    }
    clone(){
        return new this.constructor({
            currencyType: this.currencyType,
            baseCost: this.baseCost,
            initialCost: this.initialCost,
            cost: this.cost,
            costIncrease: this.costIncrease,
            boughtAmount: this.boughtAmount,
            maxPossibleBuy: this.maxPossibleBuy
        })
    }
    toStringifiableObject(){
        return {
            _type: "Cost",
            _type2: this.constructor.name,
            currencyType: this.currencyType,
            baseCost: this.baseCost,
            initialCost: this.initialCost,
            cost: this.cost,
            costIncrease: this.costIncrease,
            boughtAmount: this.boughtAmount ?? new Decimal(),
            maxPossibleBuy: this.maxPossibleBuy
        }
    }
}
/**
 * Inspired by SuperSpruce's The Unscaled Incremental, f(n) = cost
 */
class ConstantCost extends Cost{
    /** @implements */
    GetBuyCost_internal(amount){
        return this.cost.mul(amount);
    }
    /** @implements */
    GetMaxBuy_internal(){
        return this.currency.div(this.cost).floor();
    }
    /** @implements */
    GetCostForBoughtAmount(){
        return this.cost;
    }
}
/**
 * Cost that increases linearly: f(1) = cost, f(n) = f(n-1) + costIncrease
 * @constructor
 * @implements {Cost}
 */
class LinearCost extends Cost{
    /** @implements */
    GetBuyCost_internal(amount){
        return this.cost.mul(amount).plus(this.costIncrease.mul(amount).div(2).mul(Decimal.sub(amount,1)));
    }
    /** @implements */
    GetMaxBuy_internal(){
        //quadratic formula breaks when costIncrease==0
        if(this.costIncrease.eq(0)&&this.cost.gt(0)) return this.currency.div(this.cost).floor();
        if(this.costIncrease.lte(0)&&this.cost.lte(0)) return Decimal.dInf;
        //quadratic formula (see https://en.wikipedia.org/wiki/Quadratic_formula)
        let a = this.costIncrease.div(2);
        let b = this.cost.sub(a);
        let c = this.currency.neg();
        return b.neg().add(b.pow(2).sub(a.mul(c).mul(4)).sqrt()).div(this.costIncrease).floor();
    }
    /** @implements */
    GetCostForBoughtAmount(amount){
        return this.initialCost.add(this.costIncrease.mul(amount));
    }
}
/**
 * Cost that increases exponentially: f(1) = cost, f(n) = f(n-1) * costIncrease
 * @constructor
 * @implements {Cost}
 */
class ExponentialCost extends Cost{
    /** @implements */
    GetBuyCost(amount){
        return sumFunctions.sumOfExponential(this.cost,this.costIncrease,amount);
    }
    /** @implements */
    GetMaxBuy_internal(){
        return sumFunctions.inverseSumOfExponential(this.cost,this.costIncrease,this.currency).floor();
    }
    /** @implements */
    GetCostForBoughtAmount(amount){
        return this.initialCost.mul(this.costIncrease.pow(amount));
    }
}
