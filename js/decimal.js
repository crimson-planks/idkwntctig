Decimal.MagAbs=function(amount){
    if(amount.eq(0)) return amount;
    if(amount.abs().lt(1)){
        if(amount.layer==0){
            return amount.abs().recip();
        }
        else{
            return Decimal.fromComponents(1,amount.layer,Math.abs(amount.mag))
        }
    }
    else{
        return amount.abs();
    }
}
BigInt.cmp=function(a,b){if(a>b) return 1;if(a===b) return 0;else return -1;}