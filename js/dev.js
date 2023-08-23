function checkIfMoneyIsNegative(){
    if(game.matter.lt(0)) console.log("negative!!!")
}
setInterval(checkIfMoneyIsNegative, 50);