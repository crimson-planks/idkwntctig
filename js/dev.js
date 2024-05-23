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
    intervalCheckIfMatterIsNegative: undefined,
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
        baseCost: D(1),
        costIncrease: D(1)
    }),
    ec: new ExponentialCost({
        currencyType: "dev",
        baseCost: D(1),
        costIncrease: D(2)
    }),
    resetAutobuyers(){
        game?.autobuyerObject?.deflation?.forEach((autobuyer,index)=>{
            game.autobuyerObject.deflation[index]=autobuyerObject.deflation[index].clone();
        });
    },
    cloneUpgradesWithoutResetting(){
        Object.keys(upgradeObject.overflow).forEach(key => {
            if(!(key in game.upgrade.overflow)) {
                game.upgrade.overflow[key] = upgradeObject.overflow[key].clone();
            }
            else {
                game.upgrade.overflow[key].cost.baseCost = upgradeObject.overflow[key].cost.baseCost;
                game.upgrade.overflow[key].cost.initialCost = upgradeObject.overflow[key].cost.initialCost;
                game.upgrade.overflow[key].cost.maxPossibleBuy = upgradeObject.overflow[key].cost.maxPossibleBuy;
                game.upgrade.overflow[key].SyncAmount();
            }
        });
    },
    /**
     * @param {*} x x
     * @param {*} t the amount of terms
     */
    sumOfTetrationForTesting(x, base, t){
        iterx=x;
    }
}
dev.intervalCheckIfMatterIsNegative=setInterval(this.checkIfMatterIsNegative, 50)