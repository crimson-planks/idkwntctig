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
    sumOfExponential(start,buyAmount,increase){
        return ci.infiniteSumOf1divNExp(increase).mul(Decimal.pow(increase,buyAmount)).sub(ci.infiniteSumOf1divNExp(increase)).mul(start);
    },
    inverseSumOfExponential(){
        
    }
}
/*
1+   1/10+ 1/100+ 1/1000+...
1/10+1/100+1/1000+1/10000
1

*/