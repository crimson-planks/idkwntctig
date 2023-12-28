function AddAutobuyer(id){
    const t = document.getElementById("autobuyer-template");
            const divElement = document.createElement("div")
            divElement.setAttribute("id",`autobuyer-div-${id}`)
            divElement.setAttribute("class",`autobuyer-div`)
            t.childNodes.forEach(node => {
                divElement.appendChild(node.cloneNode(true))
            });
            document.getElementById("autobuyer-list-div").appendChild(divElement);
}
function ClickAutobuyerBuyButton(autobuyer){
    return autobuyer.BuyOnce();
};
function CanBuy(cost,matter){
    cost=new Decimal(cost);
    matter=new Decimal(matter);
    if(cost.gt(matter)) return false;
    else return true;
}
function ClickGainMoney(amount){
    game.matter=game.matter.add(amount);
    game.statistics.matterProduced = (game?.statistics?.matterProduced ?? new Decimal(0)).add(amount);
}
var appThis={}
var app = Vue.createApp({
    data(){
        appThis=this;
        return {
            game: game,
            visual: {
                statistics:{},
                upgrade: {
                    overflow: {}
                },
            }
        };
    },
    methods: {
        init(){
            console.log("app init");
            this.visual.autobuyerArray=[];
            this.visual.upgrade={overflow: {}};
            this.visual.statistics={}
            this.visual.version = VERSION;
            this.visual.currentTab = "autobuyer"
            this.Update();
        },
        ClickGainMoney(amount){
            ClickGainMoney(game.clickGain.mul(amount));
            this.Update();
        },
        UpdateStatistics(){
            this.visual.statistics.matterProduced = FormatValue(game?.statistics?.matterProduced);
            this.visual.statistics.deflationTime = FormatTime(variables.deflationTime/1000);
            this.visual.statistics.overflowTime = FormatTime(variables.overflowTime/1000);
            this.visual.statistics.deflation = FormatValue(game?.statistics?.deflation, {smallDec: 0});
            this.visual.statistics.showOverflow = appThis?.game?.statistics?.overflow?.gt(0) ?? false;
            this.visual.statistics.overflow = FormatValue(game?.statistics?.overflow, {smallDec: 0});
            this.visual.statistics.playTime = FormatTime(variables.playTime/1000);
            this.visual.statistics.fastestOverflowTime = FormatTime(game.statistics.fastestOverflowTime/1000);
        },
        UpdateUpgrade(){
            UpdateUpgrade();
            Object.keys(game?.upgrade?.overflow ?? {})?.forEach(key => {
                //console.log(game.upgrade.overflow[key]);
                this.visual.upgrade.overflow[key] = {};
                this.visual.upgrade.overflow[key].amount = FormatValue(game.upgrade.overflow[key].amount);
                this.visual.upgrade.overflow[key].cost = FormatValue(game.upgrade.overflow[key].cost)+ "OP";
                this.visual.upgrade.overflow[key].value = FormatValue(game.upgrade.overflow[key].value);
                this.visual.upgrade.overflow[key].computedValue = FormatValue(game.upgrade.overflow[key].computedValue);
            });
        },
        Update(){
            //console.log("update")
            UpdateDependentVariables();
            this.game = game;
            this.visual.matterPerSecond=FormatValue(variables.matterPerSecond);
            this.visual.loseMatterPerSecond=FormatValue(variables.loseMatterPerSecond);
            this.visual.netMatterPerSecond=FormatValue(variables.netMatterPerSecond);
            this.visual.autobuyerArray=[];
            this.visual.showFormula = true;
            game.autobuyerArray.forEach((autobuyer, index) => {
                this.visual.autobuyerArray[index]={}
                this.visual.autobuyerArray[index].buy={};
                this.visual.autobuyerArray[index].buy.vue_class={};
                this.visual.autobuyerArray[index].buy.vue_class["can-buy-button"] = autobuyer.CanBuyOnce();
                this.visual.autobuyerArray[index].buy.vue_class["cannot-buy-button"] = !autobuyer.CanBuyOnce();
                this.visual.autobuyerArray[index].interval_buy={};
                this.visual.autobuyerArray[index].interval_buy.vue_class={};
                this.visual.autobuyerArray[index].interval_buy.vue_class["can-buy-button"] = autobuyer.CanBuyIntervalOnce();
                this.visual.autobuyerArray[index].interval_buy.vue_class["cannot-buy-button"] = !autobuyer.CanBuyIntervalOnce();

                this.visual.autobuyerArray[index].cost=FormatValue(autobuyer.cost)+" MT";
                this.visual.autobuyerArray[index].interval=FormatValue(autobuyer.interval);
                this.visual.autobuyerArray[index].amount=FormatValue(autobuyer.amountByType["normal"], {smallDec: 0});
                let showExtraAmount = true;
                if(!autobuyer.amountByType["startAutoclicker"]) showExtraAmount = false;
                else if(autobuyer.amountByType["startAutoclicker"].eq(0)) showExtraAmount = false;
                this.visual.autobuyerArray[index].showExtraAmount=showExtraAmount;
                this.visual.autobuyerArray[index].extraAmount=FormatValue(autobuyer.amountByType["startAutoclicker"] ?? 0, {smallDec: 0});
                this.visual.autobuyerArray[index].intervalCost=FormatValue(autobuyer.intervalCost)+" MT";
                this.visual.autobuyerArray[index].active=String(autobuyer.active)
                this.visual.autobuyerArray[index].name= (index===0)?"Autoclicker":"Autobuyer "+String(index)
            });
            this.UpdateStatistics();
            this.UpdateUpgrade();
            this.visual.matter = FormatValue(game?.matter);
            this.visual.softReset0Cost = FormatValue(game?.softReset0Cost);
            this.visual.overflowForced = game?.trigger?.overflowForced;
            this.visual.overflowPoint = game?.overflowPoint;
            this.visual.isOverflowed = game?.statistics?.overflow?.gt(0);
            this.visual.clickGain = game?.clickGain;
            this.visual.deflation = FormatValue(game?.deflation, {smallDec: 0});            
        },
        ResetAutobuyerArray(){
            this.visual.autobuyerArray=[];
        },
        Test(){
            console.log(this)
        },
        MainLoop(){
            game.autobuyerArray.forEach(autobuyer => {
                autobuyer.AutoBuyLoop();
            });
            game.lastUpdated=Date.now();
        },
        ChangeTab(tab){
            this.visual.currentTab=tab;
        },
        canSoftReset(level){
            return canSoftReset(level);
        },
        ClickAutobuyerBuyButton(autobuyer){
            if(ClickAutobuyerBuyButton(autobuyer)) this.Update();
        },
        ClickIntervalUpgradeButton(autobuyer){
            if(autobuyer.BuyInterval(1)) this.Update();
        },
        ClickToggleButton(autobuyer){
            autobuyer.Toggle()
            this.Update()
        },
        ClickSoftReset0Button(){
            if(softReset(0)) this.Update();
        },
        ClickSoftReset1Button(){
            softResetForced(1);
            this.Update();
        },
        ClickBuyUpgradeButton(type, id){
            if(game.upgrade[type][id].BuyOnce()) {
                this.Update();
            }
            this.Update();

        },
        mounted(){
            this.init();
            console.log("app mounted");
        },
        created(){
            this.init();
            console.log("app created");
        },
        GameLoop(){
            this.init();
            GameLoop(this)
        }
    }
});
app.mount("#app");
var triggerObject = {
    autobuyer0: function(){
        game.trigger.autobuyer[0] = true;
        game.autobuyerArray[0] = autobuyerArray[0].clone();
        game.autobuyerArray[0].costIncrease = game.autobuyerArray[0].costIncrease.minus(game.reducedCost);
        appThis.Update();
    },
    autobuyer1: function(){
        game.trigger.autobuyer[1] = true;
        game.autobuyerArray[1] = autobuyerArray[1].clone();
        game.autobuyerArray[1].costIncrease = game.autobuyerArray[1].costIncrease.minus(game.reducedCost);
        appThis.Update();
    },
    autobuyer2: function(){
        game.trigger.autobuyer[2] = true;
        game.autobuyerArray[2] = autobuyerArray[2].clone();
        game.autobuyerArray[2].costIncrease = game.autobuyerArray[2].costIncrease.minus(game.reducedCost);
        appThis.Update();
    },
    overflowForced: function(){
        game.trigger.overflowForced = true;
        game.autobuyerArray.forEach((autobuyer,index)=>{
            autobuyer.active=false;
        })
        appThis.Update();
    },
    overflowReset(){
        game.trigger.overflowReset = true;
        game.upgrade.overflow = {};
        Object.keys(upgradeObject.overflow).forEach(key => {
            game.upgrade.overflow[key] = upgradeObject.overflow[key].clone();
        });
        appThis.Update();
    }
}
function TriggerInit(){
    if(game.trigger.autobuyer[0]){
       triggerObject.autobuyer0();
    }

    if(game.trigger.autobuyer[1]){
        triggerObject.autobuyer1();
    }

    if(game.trigger.autobuyer[2]){
        triggerObject.autobuyer2();
    }

    if(game.trigger.overflowForced){
        triggerObject.overflowForced();
    }

    if(game.trigger.overflowReset){
        triggerObject.overflowReset();
    }
}
function TriggerLoop(){
    if((game.matter.gte(10) || game?.upgrade?.overflow?.startAutoclicker?.value?.gt(0)) && !game.trigger.autobuyer[0]){
        triggerObject.autobuyer0();
    }

    if(game.matter.gte(500) && !game.trigger.autobuyer[1]){
        triggerObject.autobuyer1();
    }

    if(game.matter.gte("1e7") && !game.trigger.autobuyer[2]){
        triggerObject.autobuyer2();
    }

    if(game.matter.gte(OVERFLOW) && !game.isBreakOverflow && !game.trigger.overflowForced){
        triggerObject.overflowForced();
    }
    if(game?.statistics?.overflow?.gte(1) && !game.trigger.overflowReset){
        triggerObject.overflowReset();
    }
}
function UpdateUpgrade(){
    Object.keys(game?.upgrade?.overflow ?? {}).forEach(key => {
        game.upgrade.overflow[key].UpdateValue();
    });
}
function UpdateDependentVariables(){
    game.clickGain = new Decimal(1).add(game?.upgrade?.overflow?.matterPerClick?.value);
    variables.matterPerSecond = new Decimal();
    if(game?.autobuyerArray[0]?.active) variables.matterPerSecond = game.autobuyerArray[0].getPerSecond() ?? new Decimal(0);
    let tmp=new Decimal()
    game.autobuyerArray.forEach((autobuyer) => {
        autobuyer.UpdateAmount();
        if(autobuyer.active) tmp=tmp.add(autobuyer.getLosePerSecond());
    });
    variables.loseMatterPerSecond=tmp;
    variables.netMatterPerSecond=variables.matterPerSecond.sub(tmp);

    if(game.autobuyerArray[0]) game.autobuyerArray[0].amountByType["startAutoclicker"] = game?.upgrade?.overflow?.startAutoclicker?.computedValue ?? new Decimal(0);
}
function GameLoop(){
    game.autobuyerArray.forEach(autobuyer => {
        autobuyer.Loop();
    });
    UpdateDependentVariables();
    TriggerLoop();
    game.lastUpdated=Date.now();
    variables.playTime = game.lastUpdated - game.createdTime;
    variables.deflationTime = game.lastUpdated - game.lastDeflationTime;
    variables.overflowTime = game.lastUpdated - game.lastOverflowTime;
    appThis.UpdateStatistics();
}
init();
setInterval(GameLoop, 50);