/**
 * devtools and debugging
 */
const dev={
    /**
     * Checks if the money is negative.
     */
    checkIfMatterIsNegative: function(){
        if(game.matter.lt(0)) console.log("matter is negative!!!")
    },
    testDate: Date.now(),
    ErrorCheck: function(){
        try{
            NotImplemented
        }
        catch(err){
            return err
        }
    },
    currency: new Decimal(OVERFLOW),
    lc: new LinearCost({
        currencyType: "dev",
        cost: new Decimal(1),
        costIncrease: new Decimal(1)
    }),
    ec: new ExponentialCost({
        currencyType: "dev",
        cost: new Decimal(1),
        costIncrease: new Decimal(2)
    })
}
dev.intervalCheckIfMatterIsNegative=setInterval(this.checkIfMatterIsNegative, 50)