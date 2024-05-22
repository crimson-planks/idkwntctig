
function canSoftReset(level){
    if(level===0){
        return game.matter.gte(game.softReset0Cost) && !game.trigger.overflowForced;
    }
    if(level===1){
        return game.matter.gte(game.overflowLimit)
    }
}
function softReset(level){
    if(canSoftReset(level)) {
        softResetForced(level);
        return true;
    }
    return false;
}
function softResetForced(level){
    //console.log("softResetForced start");
    if(level>=0){
        game.autobuyerObject.matter = [];

        game.matter = game.defaultMatter;
        game.deflationPower = new Decimal();
        game.trigger.autobuyer.forEach((value,index)=>{
            game.trigger.autobuyer[index]=false;
        });
        variables.deflatorGain = game.deflation.add(1);
    }
    if(level===0){
        game.softReset0Cost=game.softReset0Cost.mul(10);
        game.deflation = game.deflation.add(1);
        if(game.tabLevel<1) game.tabLevel = 1;
        if(game.deflation.lte(4)) game.reducedCost = game.reducedCost.add(1);
        game.deflator = game.deflator.add(variables.deflatorGain);
        game.statistics.deflation = game.statistics.deflation.add(1);

        game.lastDeflationTime = Date.now();
    }
    if(level>=1){
        game.softReset0Cost = game.defaultSoftReset0Cost;
        game.autobuyerObject.deflation = [];
        game.trigger.deflation = false;
        game.deflation = D(0);
        game.deflator = D(0);
        game.trigger.overflowForced = false;
        variables.canPress.m=true;
        game.reducedCost = new Decimal(0);
    }
    if(level===1){
        game.statistics.overflow = game.statistics.overflow.add(1);
        if(game.tabLevel<2) game.tabLevel = 2;
        if(game.lastUpdated - game.lastOverflowTime < game.statistics.fastestOverflowTime) {
            game.statistics.fastestOverflowTime = game.lastUpdated - game.lastOverflowTime;
        }
        game.overflowPoint=game.overflowPoint.add(1).add(game.upgrade?.overflow?.overflowTimeMultiplier?.computedValue ?? 0);
        game.lastOverflowTime = Date.now();
    }
    GameLoop();
    appThis.Update();
    //console.log("softResetForced end")
}

function hardReset(){
    window.alert("don't you dare")
}