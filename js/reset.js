
function canSoftReset(level){
    if(level===0){
        return game.matter.gte(game.softReset0Cost)
    }
    if(level===1){
        return game.matter.gte(OVERFLOW)
    }
}
function softReset(level){
    if(canSoftReset(level)) softResetForced(level)
}
function softResetForced(level){
    if(level>=0){
        game.autobuyerArray = [];
        //for(let i in autobuyerArray){
        //    //let autobuyer = autobuyerArray[i];
        //}

        game.matter = game.defaultMatter;
        for(let i in game.trigger.autobuyer){
            game.trigger.autobuyer[i]=false;
        }
    }
    if(level===0){
        game.softReset0Cost=game.softReset0Cost.mul(10)
        game.reducedCost = game.reducedCost.add(1);
        game.statistics.deflation = game.statistics.deflation.add(1)
        if(game.reducedCost.eq(5)) game.softReset0Cost=new Decimal("1ee50")
    }
    if(level>=1){
        game.softReset0Cost = game.defaultSoftReset0Cost;
        game.statistics.deflation = new Decimal(0)
        game.trigger.overflowForced = false;
        game.reducedCost = new Decimal(0);
    }
    if(level===1){
        game.statistics.overflow = game.statistics.overflow.add(1)
        game.overflowPoint=game.overflowPoint.add(1)
    }
    appThis.ResetAutobuyerArray()
    appThis.Update();
}