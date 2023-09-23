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
    autobuyer.BuyOnce();
};
function CanBuy(cost,matter){
    cost=new Decimal(cost);
    matter=new Decimal(matter);
    if(cost.gt(matter)) return false;
    else return true;
}
function ClickGainMoney(amount){
    this.game.matter=this.game.matter.add(amount);
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
            this.visual.version = VERSION;
            this.Update();
        },
        ClickGainMoney(amount){
            ClickGainMoney(amount);
            this.Update();
        },
        Update(){
            this.visual.matter = FormatValue(game.matter);
            this.visual.softReset0Cost = FormatValue(game.softReset0Cost)
            this.visual.overflowForced = game.trigger.overflowForced
            this.visual.overflowPoint = game.overflowPoint
            this.game.autobuyerArray.forEach((autobuyer, index) => {
                this.visual.autobuyerArray[index]={}
                this.visual.autobuyerArray[index].cost=FormatValue(autobuyer.cost);
                this.visual.autobuyerArray[index].interval=FormatValue(autobuyer.interval);
                this.visual.autobuyerArray[index].amount=FormatValue(autobuyer.amount);
                this.visual.autobuyerArray[index].intervalCost=FormatValue(autobuyer.intervalCost);
                this.visual.autobuyerArray[index].active=String(autobuyer.active)
            });
        },
        ResetAutobuyerArray(){
            this.visual.autobuyerArray=[]
        },
        Test(){
            console.log(this)
        },
        MainLoop(){
            this.game.autobuyerArray.forEach(autobuyer => {
                autobuyer.AutoBuyLoop()
            });
            this.game.lastUpdated=Date.now();
        },
        ClickAutobuyerBuyButton(autobuyer){
            ClickAutobuyerBuyButton(autobuyer);
            this.Update();
        },
        ClickIntervalUpgradeButton(autobuyer){
            autobuyer.BuyInterval(1);
            this.Update();
        },
        ClickToggleButton(autobuyer){
            autobuyer.Toggle()
            this.Update()
        },
        ClickSoftReset0Button(){
            softReset(0);
            this.Update();
        },
        ClickSoftReset1Button(){
            softReset(1);
            this.Update();
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
function TriggerLoop(){
    if(game.matter.gte(10) && !game.trigger.autobuyer[0]){
        game.autobuyerArray[0] = autobuyerArray[0].clone();
        game.autobuyerArray[0].costIncrease = game.autobuyerArray[0].costIncrease.minus(game.reducedCost)
        appThis.Update();
        game.trigger.autobuyer[0] = true;
    }


    if(game.matter.gte(100) && !game.trigger.autobuyer[1]){
        game.autobuyerArray[1] = autobuyerArray[1].clone();
        game.autobuyerArray[1].costIncrease = game.autobuyerArray[1].costIncrease.minus(game.reducedCost)
        appThis.Update();
        game.trigger.autobuyer[1] = true;
    }

    if(game.matter.gte("1e7") && !game.trigger.autobuyer[2]){
        game.autobuyerArray[2] = autobuyerArray[2].clone();
        game.autobuyerArray[2].costIncrease = game.autobuyerArray[2].costIncrease.minus(game.reducedCost)
        appThis.Update();
        game.trigger.autobuyer[2] = true;
    }

    if(game.matter.gte(OVERFLOW) && !game.isBreakOverflow && !game.trigger.overflowForced){
        game.trigger.overflowForced = true;
        appThis.Update();
    }
    if(game.trigger.overflowForced){
        //softResetForced(1)
    }
}
function GameLoop(){
    game.autobuyerArray.forEach(autobuyer => {
        autobuyer.Loop();
    });
    TriggerLoop();
    game.lastUpdated=Date.now();
}
init();
setInterval(GameLoop, 50);