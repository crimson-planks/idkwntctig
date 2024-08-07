;function FormatValue(amount, property={}){
    amount=new Decimal(amount);
    if(!amount.isFinite()){return "Infinite"}
    if(!game.isBreakOverflow && amount.abs().gte(variables.overflowLimit)){
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
    //game.statistics.matterProduced = (game?.statistics?.matterProduced ?? new Decimal(0)).add(amount);
}
function GainDeflationPower(amount){
    currencies.deflationPower.set(game.deflationPower.add(amount));
   //currencies.deflationPower.set(game.deflationPower.add(amount).min(variables.deflationPowerCap));
}
function ClickGainMoney(amount){
    GainMoney(amount);
}

function UpdateEnergyConvertAmount(){
    variables.energyConvertToAmount = variables.energyConvertAmount.mul(1.602176634e-19);
}
function ConvertEnergy(amount){
    let effectiveAmount = Decimal.min(amount,currencies.matter.get())
    currencies.matter.spend(effectiveAmount);
    currencies.energy.produce(effectiveAmount.mul(1.602176634e-19));
}
function UpdateExtensionLevel(){
    let extensionLevel = D(0);
    Object.keys(game.extensionCost).forEach(id => {
        let cost = game.extensionCost[id];
        extensionLevel=extensionLevel.add(cost.boughtAmount)
    })
    game.extensionLevel = extensionLevel;
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
                energyConvertAmount: "0",
                showNews: true
            },
            visual: {
                news: {

                },
                currentTab: "autobuyer",
                currentSubTab: "matter",
                statistics:{},
                canProduceDeflationPower: false,
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
                tabProperties: {
                    autobuyer: {
                        name: "Autobuyer",
                        visible: true
                    },
                    overflow: {
                        name: "Overflow",
                        visible: false
                    },
                    option: {
                        name: "Option",
                        visible: true
                    },
                    statistics: {
                        name: "Statistics",
                        visible: true
                    },
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
                        upgrade: {
                            name: "Upgrade",
                            visible: true,
                        },
                        energy: {
                            name: "Energy",
                            visible: true,
                        },
                        extend_overflow: {
                            name: "Extend Overflow",
                            visible: true,
                        }
                    },
                    option: {
                        saving: {
                            name: "Saving",
                            visible: true,
                        },
                        visual: {
                            name: "Visual",
                            visible: true,
                        },
                    },
                    statistics: {
                        general: {
                            name: "General",
                            visible: true,
                        },
                    }
                },
                altDeflationSubtext: false,
                upgradeOrder: {
                    overflow: ["startMatter","overflowTimeMultiplier","halveIntervalDivider","deflationPowerExponent"]
                },
                upgrade: {
                    overflow: {
                        startMatter:{
                            descriptionText: "Increase the initial matter",
                            formulaText: "(amount)"
                        },
                        halveIntervalDivider:{
                            descriptionText: "Upgrading the interval divides it more",
                            formulaText: "(amount) * 0.1"
                        },
                        deflationPowerExponent:{
                            descriptionText: "Increase the exponent of the translated deflation power",
                            formulaText: "(amount) * 0.1"
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
                energy: null,
                overflowLimit: null,
                extensionLevel: null,
                extensionOverflowPointMultiplier: null,
                extensionCost: {
                    matter: null,
                    deflation: null,
                    overflow: null,
                }
            }
        };
    },
    methods: {
        init(){
            console.log("app init");
            this.visual.statistics={}
            this.visual.version = VERSION;
            this.visual.currentTab = "autobuyer"
            this.ChangeEnergyConvertAmount();
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
                this.visual.upgrade.overflow[key].cost = FormatValue(game.upgrade.overflow[key].cost.cost)+ " OP";
                this.visual.upgrade.overflow[key].value = FormatValue(game.upgrade.overflow[key].value);
                this.visual.upgrade.overflow[key].computedValue = FormatValue(game.upgrade.overflow[key].computedValue);
            });
        },
        UpdateTab(){
            let tp = this.visual.tabProperties;
            let stp = this.visual.subtabProperties;

            //global
            tp.option.visible=true;
            tp.statistics.visible=true;

            if(game.tabLevel===0){
                tp.autobuyer.visible=true;
                tp.overflow.visible=false;
                stp.autobuyer.matter.visible=true;
                stp.autobuyer.deflation.visible=false;
                stp.autobuyer.overflow.visible=false;
            }
            if(game.tabLevel===1){
                tp.autobuyer.visible=true;
                tp.overflow.visible=false;
                stp.autobuyer.matter.visible=true;
                stp.autobuyer.deflation.visible=true;
                stp.autobuyer.overflow.visible=false;
            }
            if(game.tabLevel===2){
                tp.autobuyer.visible=true;
                tp.overflow.visible=true;
                stp.autobuyer.matter.visible=true;
                stp.autobuyer.deflation.visible=true;
                stp.autobuyer.overflow.visible=true;
            }

        },
        Update(){
            //console.log("update")
            UpdateDependentVariables();
            this.game = game;
            this.UpdateAutobuyers();

            this.UpdateTab();
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
            this.visual.canProduceDeflationPower = game.deflation.gte(1);
            this.visual.clickGain = FormatValue(game?.clickGain, {smallDec: 0});
            this.visual.altDeflationSubtext = game?.deflation.gte(4);
            this.visual.deflatorGain = FormatValue(variables.deflatorGain, {smallDec: 0})
            this.visual.deflation = FormatValue(game?.deflation, {smallDec: 0});

            this.visual.deflator = FormatValue(game?.deflator);
            this.visual.deflationPower = FormatValue(game?.deflationPower);
            this.visual.deflationPowerTranslation = FormatValue(variables?.deflationPowerTranslation);

            this.visual.energy = FormatValue(game?.energy)+ " " + currencies.energy.abbreviation;
            this.visual.energyTranslation = FormatValue(variables.energyTranslation);
            //this.visual.deflationPowerCap = FormatValue(variables?.deflationPowerCap);
            
            this.visual.overflow_button.vue_class["can-buy-button"] = this.canSoftReset(1);
            this.visual.overflow_button.vue_class["cannot-buy-button"] = !this.canSoftReset(1);

            this.visual.overflowLimit = FormatValue_internal(variables.overflowLimit);
            this.visual.extensionLevel = FormatValue(game.extensionLevel,{smallDec: 0});
            this.visual.extensionOverflowPointMultiplier = FormatValue(variables.extensionOverflowPointMultiplier)
            this.visual.extensionCost.matter = FormatValue(game.extensionCost.matter.cost)
            this.visual.extensionCost.deflationPower = FormatValue(game.extensionCost.deflationPower.cost)
            this.visual.extensionCost.overflow = FormatValue(game.extensionCost.overflow.cost)
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
            if(autobuyer.BuyOnce()) this.Update();
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
            if(game.deflation.lt(1)) return;
            GainDeflationPower(1);
            GameLoop();
            this.Update();
        },
        ClickSoftResetForced1Button(){
            softResetForced(1);
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
        ChangeEnergyConvertAmount(){
            variables.energyConvertAmount = D(this.input.energyConvertAmount);
            UpdateEnergyConvertAmount();
            this.visual.energyConvertAmount = FormatValue(variables.energyConvertAmount);
            this.visual.energyConvertToAmount = FormatValue(variables.energyConvertToAmount);
            this.Update();

        },
        ClickConvertEnergyButton(){
            ConvertEnergy(variables.energyConvertAmount);
            this.Update();
        },
        ClickConvertExtensionLevel(kind="matter"){
            if(kind==="matter") game.extensionCost.matter.Buy(1);
            if(kind==="deflationPower") game.extensionCost.deflationPower.Buy(1);
            if(kind==="overflow") game.extensionCost.overflow.Buy(1);
            UpdateExtensionLevel();
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
        game.matter=variables.overflowLimit;
        game.trigger.overflowForced = true;
        game.trigger.overflowForcedRevert = false;
        variables.canPress.m=false;
        //game.autobuyerObject.matter.forEach((autobuyer,index)=>{
        //    autobuyer.active=false;
        //});
        GameLoop();
        appThis.Update();
    },
    overflowForcedRevert: function(){
        game.trigger.overflowForced = false;
        game.trigger.overflowForcedRevert = true;
        variables.canPress.m=true;
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

    if(game.trigger.overflowForcedRevert){
        triggerObject.overflowForcedRevert();
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

    if(game.matter.gte(1e7) && !game.trigger.autobuyer[2]){
        triggerObject.autobuyer2();
    }
    if(game?.statistics?.deflation?.gt(0) && !game.trigger.deflation){
        triggerObject.deflation();
    }
    if(game.matter.gte(variables.overflowLimit) && !game.isBreakOverflow && !game.trigger.overflowForced){
        triggerObject.overflowForced();
    }
    if(game.matter.lt(variables.overflowLimit) && !game.trigger.overflowForcedRevert){
        triggerObject.overflowForcedRevert();
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

    if(game?.autobuyerObject.matter[0]?.active) variables.matterPerSecondSource.autoclicker = game?.autobuyerObject?.matter[0]?.getPerSecond() ?? D(0);
    variables.matterPerSecond=variables.matterPerSecondSource.autoclicker;

    variables.intervalDivide = new Decimal(2).add(game.upgrade?.overflow?.halveIntervalDivider?.computedValue);
    
    let loseMatterPerSecond = Decimal.dZero;
    let lps = game?.autobuyerObject?.overflow?.metaBuy?.getLosePerSecond().mul(
              +game?.autobuyerObject?.overflow?.metaBuy?.active);
    loseMatterPerSecond = loseMatterPerSecond.add(lps);
    game.autobuyerObject.matter.forEach((autobuyer) => {
        autobuyer.UpdateNormalInterval();
        autobuyer.UpdateAmount();
        if(autobuyer.active){
            let lps = autobuyer.getLosePerSecond();
            loseMatterPerSecond=loseMatterPerSecond.add(lps);
            variables.loseMatterPerSecondSource.autobuyers.matter[autobuyer.tier]=lps;
        }
    });
    variables.extensionOverflowPointMultiplier = D(1).add(game.extensionLevel.pow(2));
    variables.overflowPointGain = D(1).add(game.upgrade?.overflow?.overflowTimeMultiplier?.computedValue ?? 0)
                                      .mul(variables.extensionOverflowPointMultiplier);
    variables.overflowLimit = OVERFLOW.mul(Decimal.pow(2,game.extensionLevel));
    variables.deflatorGain = game.deflation.add(1);

    variables.loseMatterPerSecond=loseMatterPerSecond;
    variables.netMatterPerSecond=variables.matterPerSecond.sub(loseMatterPerSecond);
    variables.deflationPowerCap = game?.autobuyerObject?.matter[0]?.amountByType?.normal?.mul(5)?.add(10).mul(4);

    variables.deflationPowerTranslation=game.deflationPower.pow(D(0.5).add(game?.upgrade?.overflow?.deflationPowerExponent?.computedValue)).mul(2);
    
    variables.energyTranslation = game.energy.max(1e-20).absLog10().add(20).div(4).pow(3).add(1);
    
    game.defaultMatter = Decimal.dZero.add(game?.upgrade?.overflow?.startMatter?.computedValue);
    if(game.autobuyerObject.matter[0]) game.autobuyerObject.matter[0].amountByType["startAutoclicker"] = game?.upgrade?.overflow?.startAutoclicker?.computedValue ?? D(0);
}
function mountApp(){
    try{
        app.component('Autobuyer', AutobuyerComponent);
        app.component('News', NewsComponent);
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
        autobuyer.intervalByType.normal = Decimal.pow(variables.intervalDivide,autobuyer.intervalCost.boughtAmount).recip();
        //if(game.trigger.overflowReset) autobuyer.intervalByType.startIntervalReducer = game?.upgrade?.overflow?.startIntervalReducer?.computedValue?.recip() ?? new Decimal(1);
        if(autobuyer.tier===0 && game.trigger.overflowReset) autobuyer.intervalByType.energy = variables.energyTranslation.recip();
        autobuyer.cost.initialCost=autobuyer.cost.baseCost.minus(variables.deflationPowerTranslation);
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
    //if(game?.upgrade?.overflow?.startIntervalReducer?.amount?.gte(0)) appThis.Update();
}
mountApp();
init();
const GameLoopIntervalId = setInterval(GameLoop, 50);
const saveIntervalId = setInterval(save, 10000);
function keydownEvent(ev){
    appThis.visual.showFormula=ev.shiftKey;
    if(ev.code==="KeyM"&&variables.canPress.m){
        Object.keys(game.autobuyerObject).forEach((key)=>{
            if(key==="overflow") return;
            Object.keys(game.autobuyerObject[key]).forEach(index=>{
                game.autobuyerObject[key][index]?.BuyMaxInterval();
            })
        });
        appThis.Update();
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