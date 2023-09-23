/**
 * devtools and debugging
 */
const dev={
    /**
     * Checks if the money is negative.
     */
    checkIfMoneyIsNegative: function(){
        if(game.matter.lt(0)) console.log("negative!!!")
    }
}
setInterval(dev.checkIfMoneyIsNegative, 50);