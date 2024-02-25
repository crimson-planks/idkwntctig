/**
 * devtools and debugging
 */
const dev={
    /**
     * Checks if the money is negative.
     */
    checkIfMatterIsNegative(){
        if(game.matter.lt(0)) console.log("matter is negative!!!")
    },
    testDate: Date.now(),
    ErrorCheck(){
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
        baseCost: new Decimal(1),
        costIncrease: new Decimal(1)
    }),
    ec: new ExponentialCost({
        currencyType: "dev",
        baseCost: new Decimal(1),
        costIncrease: new Decimal(2)
    }),
    /**
     * @param {*} x x
     * @param {*} t the amount of terms
     */
    sumOfTetrationForTesting(x, t){
        
    }
}
dev.intervalCheckIfMatterIsNegative=setInterval(this.checkIfMatterIsNegative, 50)