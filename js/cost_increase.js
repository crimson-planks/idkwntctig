
/** 
 * object containing various summation functions
*/
var costIncrease={
    /**
     * @deprecated
     */
    sumOfLinear_naive(start,increase,buyAmount){
        let result = 0;
        for(let i=0;i<buyAmount;i++){
            result += increase*i+start
        }
        return result
    },
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
    /**
     * infinite geometric series of 1/n
     * @param {Decimal} n 
     * @returns {Decimal}
     */
    infiniteSumOf1divNExp(n){
        return Decimal.sub(n,1).recip();
    },
    /**
     * inverse of infiniteSumOf1divNExp;
     * @param {Decimal} n 
     * @returns {Decimal}
     */
    inverseInfiniteSumOf1divNExp(n){
        return Decimal.recip(n).add(1);
    },
    /**
     * finite geometric series; sum of (start)(x^increase)
     * @param {Decimal} start 
     * @param {Decimal} increase 
     * @param {Decimal} buyAmount 
     * @returns {Decimal}
     */
    sumOfExponential(start,increase,buyAmount){
        //return sum
        if(Decimal.eq(increase,1)) return Decimal.mul(start,buyAmount);
        return costIncrease.infiniteSumOf1divNExp(increase).mul(Decimal.pow(increase,buyAmount).sub(1)).mul(start);
    },
    /**
     * inverse of sumOfExponential; sum of
     * @param {Decimal} start 
     * @param {Decimal} increase 
     * @param {Decimal} sum 
     * @returns {Decimal}
     */
    inverseSumOfExponential(start,increase,sum){
        //return buyAmount
        return Decimal.div(sum,start).div(costIncrease.infiniteSumOf1divNExp(increase)).add(1).log(increase);
    },
}
/*
1+   1/10+ 1/100+ 1/1000+...
1/10+1/100+1/1000+1/10000
1

*/