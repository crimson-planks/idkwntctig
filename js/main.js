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
}
var appThis={}
var app = Vue.createApp({
    data(){
        appThis=this;
        return {
            game: game,
            visual: {}
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
        Update(){
            //console.log("update")
            UpdateDependentVariables();
            this.game = game;
            this.visual.matterPerSecond=FormatValue(game.matterPerSecond);
            this.visual.loseMatterPerSecond=FormatValue(game.loseMatterPerSecond);
            this.visual.netMatterPerSecond=FormatValue(game.netMatterPerSecond);
            this.visual.autobuyerArray=[];
            game.autobuyerArray.forEach((autobuyer, index) => {
                this.visual.autobuyerArray[index]={}
                this.visual.autobuyerArray[index].cost=FormatValue(autobuyer.cost);
                this.visual.autobuyerArray[index].interval=FormatValue(autobuyer.interval);
                this.visual.autobuyerArray[index].amount=FormatValue(autobuyer.amount, {smallDec: 0});
                this.visual.autobuyerArray[index].intervalCost=FormatValue(autobuyer.intervalCost);
                this.visual.autobuyerArray[index].active=String(autobuyer.active)
                this.visual.autobuyerArray[index].name= (index===0)?"Autoclicker":"Autobuyer "+String(index)
            });

            Object.keys(game?.upgrade?.overflow ?? {})?.forEach(key => {
                //console.log(game.upgrade.overflow[key]);
                this.visual.upgrade.overflow[key] = {};
                this.visual.upgrade.overflow[key].amount = FormatValue(game.upgrade.overflow[key].amount);
                this.visual.upgrade.overflow[key].cost = FormatValue(game.upgrade.overflow[key].cost);
                this.visual.upgrade.overflow[key].value = FormatValue(game.upgrade.overflow[key].value);
            });
            this.visual.matter = FormatValue(game.matter);
            this.visual.softReset0Cost = FormatValue(game.softReset0Cost);
            this.visual.overflowForced = game.trigger.overflowForced;
            this.visual.overflowPoint = game.overflowPoint;
            this.visual.isOverflowed = game.statistics.overflow.gt(0);
            this.visual.clickGain = game.clickGain;
            this.visual.deflation = FormatValue(game.statistics.deflation, {smallDec: 0});
        },
        ResetAutobuyerArray(){
            this.visual.autobuyerArray=[]
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
            if(game.upgrade[type][id].BuyOnce()) this.Update();
        },
        mounted(){
            this.init();
            console.log("app mounted")
        },
        created(){
            this.init();
            console.log("app created")
        },
        GameLoop(){
            this.init();
            GameLoop(this)
        }
    }
});
app.mount("#app");
function TriggerInit(){
    if(game.trigger.autobuyer[0]){
        game.trigger.autobuyer[0] = true;
        game.autobuyerArray[0] = autobuyerArray[0].clone();
        game.autobuyerArray[0].costIncrease = game.autobuyerArray[0].costIncrease.minus(game.reducedCost)
        appThis.Update();
    }

    if(game.trigger.autobuyer[1]){
        game.trigger.autobuyer[1] = true;
        game.autobuyerArray[1] = autobuyerArray[1].clone();
        game.autobuyerArray[1].costIncrease = game.autobuyerArray[1].costIncrease.minus(game.reducedCost)
        appThis.Update();
    }

    if(game.trigger.autobuyer[2]){
        game.trigger.autobuyer[2] = true;
        game.autobuyerArray[2] = autobuyerArray[2].clone();
        game.autobuyerArray[2].costIncrease = game.autobuyerArray[2].costIncrease.minus(game.reducedCost)
        appThis.Update();
    }

    if(game.trigger.overflowForced){
        game.trigger.overflowForced = true;
        game.autobuyerArray.forEach((autobuyer,index)=>{
            autobuyer.active=false;
        })
        appThis.Update();
    }
}
function TriggerLoop(){
    if(game.matter.gte(10) && !game.trigger.autobuyer[0]){
        game.trigger.autobuyer[0] = true;
        game.autobuyerArray[0] = autobuyerArray[0].clone();
        game.autobuyerArray[0].costIncrease = game.autobuyerArray[0].costIncrease.minus(game.reducedCost)
        appThis.Update();
    }

    if(game.matter.gte(500) && !game.trigger.autobuyer[1]){
        game.trigger.autobuyer[1] = true;
        game.autobuyerArray[1] = autobuyerArray[1].clone();
        game.autobuyerArray[1].costIncrease = game.autobuyerArray[1].costIncrease.minus(game.reducedCost)
        appThis.Update();
    }

    if(game.matter.gte("1e7") && !game.trigger.autobuyer[2]){
        game.trigger.autobuyer[2] = true;
        game.autobuyerArray[2] = autobuyerArray[2].clone();
        game.autobuyerArray[2].costIncrease = game.autobuyerArray[2].costIncrease.minus(game.reducedCost)
        appThis.Update();
    }

    if(game.matter.gte(OVERFLOW) && !game.isBreakOverflow){
        game.trigger.overflowForced = true;
        game.autobuyerArray.forEach((autobuyer,index)=>{
            autobuyer.active=false;
        })
        appThis.Update();
    }
    //if(game.trigger.overflowForced){
    //    //softResetForced(1)
    //}
    
    if(game.statistics.overflow.gte(1) && !game.trigger.hasOverflown){
        game.trigger.hasOverflown = true;
        game.upgrade.overflow = {}
        Object.keys(upgradeObject.overflow).forEach(key => {
            game.upgrade.overflow[key] = upgradeObject.overflow[key].clone();
        });
        appThis.Update();
    }
}
function UpdateDependentVariables(){
    game.clickGain = new Decimal(1).add(game?.upgrade?.overflow?.matterPerClick?.value);
    game.matterPerSecond = new Decimal();
    if(game?.autobuyerArray[0]?.active) game.matterPerSecond = game.autobuyerArray[0].getPerSecond() ?? new Decimal(0);
    let tmp=new Decimal()
    game.autobuyerArray.forEach((autobuyer,index) => {
        if(autobuyer.active) tmp=tmp.add(autobuyer.getLosePerSecond());
    });
    game.loseMatterPerSecond=tmp;
    game.netMatterPerSecond=game.matterPerSecond.sub(tmp);
}
function GameLoop(){
    game.autobuyerArray.forEach(autobuyer => {
        autobuyer.Loop();
    });
    UpdateDependentVariables();
    TriggerLoop();
    game.lastUpdated=Date.now();
}
init();
setInterval(GameLoop, 50);