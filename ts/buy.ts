import Decimal, {DecimalSource} from "./break_eternity";
/** 
 * object containing various summation functions
*/
export var costIncrease={
    sumOfLinear(start: DecimalSource,increase: DecimalSource,buyAmount: DecimalSource){
        return new Decimal(start).mul(buyAmount)
    },
    infiniteSumOf1divNExp(n: DecimalSource){
        return Decimal.sub(n,1).recip();
    },
    inverseInfiniteSumOf1divNExp(n: DecimalSource){
        return Decimal.recip(n).add(1);
    },
    sumOfExponential(start: DecimalSource,increase: DecimalSource,buyAmount: DecimalSource){
        //return sum
        return costIncrease.infiniteSumOf1divNExp(increase).mul(Decimal.pow(increase,buyAmount).sub(1)).mul(start);
    },
    inverseSumOfExponential(start: DecimalSource,increase: DecimalSource,sum: DecimalSource){
        //return buyAmount
        return Decimal.div(sum,start).div(costIncrease.infiniteSumOf1divNExp(increase)).add(1).log(increase);
    },
}
export function CanBuy(cost: DecimalSource,availableResources: DecimalSource){
    cost=new Decimal(cost);
    availableResources=new Decimal(availableResources);
    if(cost.gt(availableResources)) return false;
    else return true;
}
/*
1+   1/10+ 1/100+ 1/1000+...
1/10+1/100+1/1000+1/10000
1

*/