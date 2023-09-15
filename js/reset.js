function canSoftReset(level){
    if(level===0){
        return game.matter.gte(game.softReset0Cost)
    }
}
function softReset(level){
    if(canSoftReset(level)) softResetForced(level)
}
function softResetForced(level){
    if(level>=0){
        game.matter = game.defaultMoney;
        for(i in game.trigger.autobuyer){
            game.trigger.autobuyer[i]=false;
        }

        game.autobuyerArray = [];
        game.reducedCost = game.reducedCost.add(1);
        let i;
        for(i in autobuyerArray){
            let autobuyer = autobuyerArray[i];
        }
        game.softReset0Cost=game.softReset0Cost.mul(10)
        if(autobuyerArray[0].costIncrease.eq(0)) game.softReset0Cost=new Decimal("1e50")
    }
    if(level>=1){
        
        
    }
    appThis.ResetAutobuyerArray()
    appThis.Update();
}