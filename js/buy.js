//costIncrease
var ci={
    sumOfLinear(start,buyAmount,increase){
        return start.mul(buyAmount)
    },
    infiniteSumOf1divNExp(n){
        return Decimal.sub(n,1).recip();
    },
    inverseInfiniteSumOf1divNExp(n){
        return Decimal.recip(n).add(1);
    },
    sumOfExponential(start,increase,buyAmount){
        //return sum
        return ci.infiniteSumOf1divNExp(increase).mul(Decimal.pow(increase,buyAmount).sub(1)).mul(start);
    },
    inverseSumOfExponential(start,increase,sum){
        //return buyAmount
        return Decimal.div(sum,start).div(ci.infiniteSumOf1divNExp(increase)).add(1).log(increase);
    },
}
/*
1+   1/10+ 1/100+ 1/1000+...
1/10+1/100+1/1000+1/10000
1

*/