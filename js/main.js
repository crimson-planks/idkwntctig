;function FormatValue(amount, property={}){
    amount=new Decimal(amount);
    if(!amount.isFinite()){return "Infinite"}
    if(!game.isBreakOverflow && amount.abs().gte(game.overflowLimit)){
        return "Error: Overflow"
    }
    return FormatValue_internal(amount,property);
}
function ClickAutobuyerBuyButton(autobuyer){
    return autobuyer.BuyOnce();
};
function CanBuy(cost,money){
    return new Decimal(cost).lte(money);
}
function GainMoney(amount){
    currencies.matter.produce(amount);
    game.statistics.matterProduced = (game?.statistics?.matterProduced ?? new Decimal(0)).add(amount);
}
function GainDeflationPower(amount){
    currencies.deflationPower.set(game.deflationPower.add(amount));
   //currencies.deflationPower.set(game.deflationPower.add(amount).min(variables.deflationPowerCap));
}
function ClickGainMoney(amount){
    GainMoney(amount);
}

var appThis={};
var bus={app: appThis, autobuyer: {}};
var app = Vue.createApp({
    data(){
        appThis=this;
        return {
            game,
            variables,
            input: {
                notation: "scientific",
                showNews: true
            },
            visual: {
                news: {

                },
                currentTab: "autobuyer",
                currentSubTab: "matter",
                statistics:{},
                notationArray,
                overflow_button: {
                    vue_class: {
                        "cannot-buy-button": true,
                        "can-buy-button": false
                    }
                },
                tabs,
                tabOrder: tabs,
                subTabs: subTabs,
                selectedSubTabs: {
                    autobuyer: "matter",
                    overflow: "upgrades",
                    option: "saving",
                    statistics: "general"
                }, 
                tabName: {
                    autobuyer: "Autobuyers",
                    overflow: "Overflow",
                    option: "Options",
                    statistics: "Statistics",
                },
                subTabName: {
                    autobuyer: {
                        matter: "Matter",
                        deflation: "Deflation",
                        overflow: "Overflow",
                    },
                    overflow: {
                        upgrade: "Upgrade",
                        energy: "Energy"
                    },
                    option: {
                        saving: "Saving",
                        visual: "Visual"
                    },
                    statistics: {
                        general: "General"
                    }
                },
                subtabProperties: {
                    autobuyer: {
                        matter: {
                            name: "Matter",
                            visible: true,
                        },
                        deflation: {
                            name: "Deflation",
                            visible: false,
                        },
                        overflow: {
                            name: "Overflow",
                            visible: false,
                        }
                    },
                    overflow: {
                        upgrade: "Upgrade",
                        energy: "Energy",
                    },
                    option: {
                        saving: "Saving",
                        visual: "Visual",
                    },
                    statistics: {
                        general: "General",
                    }
                },
                altDeflationSubtext: false,
                upgradeOrder: {
                    overflow: ["startMatter","overflowTimeMultiplier","startIntervalReducer"]
                },
                upgrade: {
                    overflow: {
                        startMatter:{
                            descriptionText: "Increase the initial matter",
                            formulaText: "(amount)"
                        },
                        startAutoclicker:{
                            descriptionText: "Get extra autoclickers",
                            formulaText: "(amount) * 10"
                        },
                        overflowTimeMultiplier:{
                            descriptionText: "Get more overflow points depending of the fastest overflow time (see statistics)",
                            formulaText: "ceil(1e7 / ((fastest overflow time(in milliseconds)) + 1e4))"
                        },
                        startIntervalReducer:{
                            descriptionText: "Reduce the interval of all autobuyers(including autoclickers) that gets weaker as time passes, resetting on overflow",
                            formulaText: "..."
                        }
                    }
                },
            }
        };
    },
    methods: {
        init(){
            console.log("app init");
            this.visual.statistics={}
            this.visual.version = VERSION;
            this.visual.currentTab = "autobuyer"
            this.Update();
        },
        ClickGainMoney(amount){
            ClickGainMoney(game.clickGain.mul(amount));
            this.Update();
        },
        UpdateNews(){
            
        },
        UpdateAutobuyers(){
            Object.keys(bus.autobuyer).forEach(type=>{
                Object.keys(bus.autobuyer[type]).forEach(tier=>{
                    bus.autobuyer[type][tier].Update();
                });
            });
        },
        UpdateStatistics(){
            this.visual.statistics.matterProduced = FormatValue(game?.statistics?.matterProduced);
            this.visual.statistics.deflationTime = FormatTime(variables.deflationTime/1000);
            this.visual.statistics.overflowTime = FormatTime(variables.overflowTime/1000);
            this.visual.statistics.deflation = FormatValue(game?.statistics?.deflation, {smallDec: 0});
            this.visual.statistics.showOverflow = this?.game?.statistics?.overflow?.gt(0) ?? false;
            this.visual.statistics.overflow = FormatValue(game?.statistics?.overflow, {smallDec: 0});
            this.visual.statistics.playTime = FormatTime(variables.playTime/1000);
            this.visual.statistics.fastestOverflowTime = FormatTime(game.statistics.fastestOverflowTime/1000);
        },
        UpdateUpgrade(){
            UpdateUpgrade();
            Object.keys(game?.upgrade?.overflow ?? {})?.forEach(key => {
                //console.log(game.upgrade.overflow[key]);
                this.visual.upgrade.overflow[key] = this.visual.upgrade.overflow[key] ?? {};
                this.visual.upgrade.overflow[key].amount = FormatValue(game.upgrade.overflow[key].amount);
                this.visual.upgrade.overflow[key].isBoughtMax = game.upgrade.overflow[key].cost.isBoughtMax();
                this.visual.upgrade.overflow[key].cost = FormatValue(game.upgrade.overflow[key].cost.cost)+ "OP";
                this.visual.upgrade.overflow[key].value = FormatValue(game.upgrade.overflow[key].value);
                this.visual.upgrade.overflow[key].computedValue = FormatValue(game.upgrade.overflow[key].computedValue);
            });
        },
        Update(){
            //console.log("update")
            UpdateDependentVariables();
            this.game = game;
            this.UpdateAutobuyers();

            this.visual.matterPerSecond=FormatValue(variables.matterPerSecond);
            this.visual.loseMatterPerSecond=FormatValue(variables.loseMatterPerSecond);
            this.visual.netMatterPerSecond=FormatValue(variables.netMatterPerSecond);
            this.UpdateStatistics();
            this.UpdateUpgrade();
            this.visual.matter = FormatValue(game?.matter);
            this.visual.softReset0Cost = FormatValue(game?.softReset0Cost);
            this.visual.overflowForced = game?.trigger?.overflowForced;
            this.visual.overflowPoint = FormatValue(game?.overflowPoint,{smallDec: 0});
            this.visual.isOverflowed = game?.statistics?.overflow?.gt(0);
            this.visual.clickGain = FormatValue(game?.clickGain, {smallDec: 0});
            this.visual.altDeflationSubtext = game?.deflation.gte(4);
            this.visual.deflatorGain = FormatValue(variables.deflatorGain, {smallDec: 0})
            this.visual.deflation = FormatValue(game?.deflation, {smallDec: 0});

            this.visual.deflator = FormatValue(game?.deflator);
            this.visual.deflationPower = FormatValue(game?.deflationPower);
            this.visual.deflationPowerStrength = FormatValue(variables?.deflationPowerStrength);
            //this.visual.deflationPowerCap = FormatValue(variables?.deflationPowerCap);
            
            this.visual.overflow_button.vue_class["can-buy-button"] = this.canSoftReset(1);
            this.visual.overflow_button.vue_class["cannot-buy-button"] = !this.canSoftReset(1);
        },
        Test(){
            console.log(this)
        },
        MainLoop(){
            Object.keys(game.autobuyerObject).forEach(key => {
                Object.keys(game.autobuyerObject[key]).forEach(index =>{
                    game.autobuyerObject[key][index].AutoBuyLoop();
                });
            });
            game.lastUpdated=Date.now();
        },
        ChangeTab(tab){
            this.visual.currentTab=tab;
            this.visual.currentSubTab=this.visual.selectedSubTabs[tab];
        },
        ChangeSubTab(subTab){
            this.visual.currentSubTab=subTab;
            this.visual.selectedSubTabs[this.visual.currentTab]=subTab;
        },
        ChangeNotation(notation){
            game.notation=notation;
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
            autobuyer.Toggle();
            this.Update();
        },
        ClickSoftReset0Button(){
            if(softReset(0)) this.Update();
        },
        ClickGainDeflationPower(){
            GainDeflationPower(1);
            GameLoop();
            this.Update();
        },
        ClickSoftReset1Button(){
            softReset(1);
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
    },
    computed: {
    }
});
var triggerObject = {
    autobuyer0: function(){
        game.trigger.autobuyer[0] = true;
        game.autobuyerObject.matter = [];
        game.autobuyerObject.matter[0] = autobuyerObject.matter[0].clone();
        game.autobuyerObject.matter[0].cost.costIncrease = game.autobuyerObject.matter[0].cost.costIncrease.minus(game.reducedCost);
        GameLoop();
        appThis.Update();
    },
    autobuyer1: function(){
        game.trigger.autobuyer[1] = true;
        game.autobuyerObject.matter[1] = autobuyerObject.matter[1].clone();
        game.autobuyerObject.matter[1].cost.costIncrease = game.autobuyerObject.matter[1].cost.costIncrease.minus(game.reducedCost);
        GameLoop();
        appThis.Update();
    },
    autobuyer2: function(){
        game.trigger.autobuyer[2] = true;
        game.autobuyerObject.matter[2] = autobuyerObject.matter[2].clone();
        game.autobuyerObject.matter[2].cost.costIncrease = game.autobuyerObject.matter[2].cost.costIncrease.minus(game.reducedCost);
        GameLoop();
        appThis.Update();
    },
    deflation: function(){
        game.trigger.deflation = true;
        game.autobuyerObject.deflation = [];
        game.autobuyerObject.deflation[0] = autobuyerObject.deflation[0].clone();
        GameLoop();
        appThis.Update();
    },
    overflowForced: function(){
        game.trigger.overflowForced = true;
        variables.canPress.m=false;
        game.autobuyerObject.matter.forEach((autobuyer,index)=>{
            autobuyer.active=false;
        });
        GameLoop();
        appThis.Update();
    },
    overflowReset(){
        console.log("overflowReset");
        game.trigger.overflowReset = true;
        game.upgrade.overflow = {};
        Object.keys(upgradeObject.overflow).forEach(key => {
            game.upgrade.overflow[key] = upgradeObject.overflow[key].clone();
        });
        game.autobuyerObject.overflow={};
        Object.keys(autobuyerObject.overflow).forEach(key => {
            game.autobuyerObject.overflow[key] = autobuyerObject.overflow[key].clone();
        });
        GameLoop();
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

    if(game.trigger.deflation){
        triggerObject.deflation();
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
    if(game?.statistics?.deflation?.gt(0) && !game.trigger.deflation){
        triggerObject.deflation();
    }
    if(game.matter.gte(game.overflowLimit) && !game.isBreakOverflow && !game.trigger.overflowForced){
        triggerObject.overflowForced();
    }
    if(game?.statistics?.overflow?.gt(0) && !game.trigger.overflowReset){
        triggerObject.overflowReset();
    }
}
function UpdateUpgrade(){
    Object.keys(game?.upgrade?.overflow ?? {}).forEach(key => {
        game.upgrade.overflow[key]?.UpdateValue();
    });
}
function UpdateDependentVariables(){
    game.clickGain = new Decimal(1);
    variables.matterPerSecond = Decimal.dZero;
    if(game?.autobuyerObject.matter[0]?.active) variables.matterPerSecond = game.autobuyerObject.matter[0].getPerSecond() ?? new Decimal(0);
    let tmp=Decimal.dZero;
    game.autobuyerObject.matter.forEach((autobuyer) => {
        autobuyer.UpdateAmount();
        if(autobuyer.active) tmp=tmp.add(autobuyer.getLosePerSecond());
    });
    variables.loseMatterPerSecond=tmp;
    variables.netMatterPerSecond=variables.matterPerSecond.sub(tmp);
    variables.deflationPowerCap = game?.autobuyerObject?.matter[0]?.amountByType?.normal?.mul(5)?.add(10).mul(4);

    variables.deflationPowerStrength=game.deflationPower.div(4);
    game.defaultMatter = Decimal.dZero.add(game?.upgrade?.overflow?.startMatter?.computedValue);
    if(game.autobuyerObject.matter[0]) game.autobuyerObject.matter[0].amountByType["startAutoclicker"] = game?.upgrade?.overflow?.startAutoclicker?.computedValue ?? new Decimal(0);
}
function mountApp(){
    try{
        app.component('Autobuyer', AutobuyerComponent);
        app.mount("#app");
    }
    catch(error){
        const spanElement = document.createElement("span")
        spanElement.appendChild(document.createTextNode("An error occured: "+String(error)));
        spanElement.append(document.createElement("br"))
        spanElement.append(document.createTextNode(String(error?.stack)))
        document.body.insertBefore(spanElement,document.getElementById("app"));
        throw error;
    }
}
function InputLoop(){
    if(game.notation !== appThis.input.notation) {
        game.notation = appThis.input.notation;
        appThis.Update();
    }
}
function GameLoop(){
    UpdateDependentVariables();
    game.autobuyerObject.matter.forEach(autobuyer=>{
        autobuyer.intervalByType.startIntervalReducer = game?.upgrade?.overflow?.startIntervalReducer?.computedValue?.recip() ?? new Decimal(1);
        autobuyer.cost.initialCost=autobuyer.cost.baseCost.minus(variables.deflationPowerStrength);
        autobuyer.cost.UpdateCost();
    });
    Object.keys(game.autobuyerObject).forEach(key => {
        Object.keys(game.autobuyerObject[key]).forEach(index => {
            let autobuyer = game.autobuyerObject[key][index];
            autobuyer.Loop();
        })
    });
    InputLoop();
    UpdateDependentVariables();
    TriggerLoop();
    game.lastUpdated=Date.now();
    variables.playTime = game.lastUpdated - game.createdTime;
    variables.deflationTime = game.lastUpdated - game.lastDeflationTime;
    variables.overflowTime = game.lastUpdated - game.lastOverflowTime;
    appThis.UpdateStatistics();
    appThis.UpdateUpgrade();
    if(game?.upgrade?.overflow?.startIntervalReducer?.amount?.gte(0)) appThis.Update();
}
mountApp();
init();
const GameLoopIntervalId = setInterval(GameLoop, 50);
const saveIntervalId = setInterval(save, 10000);
function keydownEvent(ev){
    appThis.visual.showFormula=ev.shiftKey;
    if(ev.code==="KeyM"&&variables.canPress.m){
        Object.keys(game.autobuyerObject).forEach((key)=>{
            Object.keys(game.autobuyerObject[key]).forEach(index=>{
                game.autobuyerObject[key][index]?.BuyMaxInterval();
            })
        });
    }
    if(ev.code==="KeyO"){
        if(softReset(1)) appThis.Update();
    }
}
function keyUpEvent(ev){
    appThis.visual.showFormula=ev.shiftKey;
}
function variablesInit(){
    variables.deflatorGain = game.deflation.add(1);
    variables.canPress.m=!game.trigger.overflowForced;
}
addEventListener("keydown",keydownEvent)
addEventListener("keyup",keyUpEvent)
console.log("game start")
//11,21,22,33,31,32,42,41,51,62,61,72,71,81,82,73,83,93,92,91,103,102,101,111,123,133,143,151,161,162,171,181,192,191,193,213,214,212,211|0