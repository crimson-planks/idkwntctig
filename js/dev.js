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
    testDate: Date.now()
}
dev.intervalCheckIfMatterIsNegative=setInterval(this.checkIfMatterIsNegative, 50)