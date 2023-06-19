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
function CanBuy(cost,money){
    cost=new Decimal(cost);
    money=new Decimal(money);
    if(cost.gt(money)) return false;
    else return true;
}
function ClickGainMoney(amount){
    this.game.money=this.game.money.add(amount);
}
var appThis={}
var app = Vue.createApp({
    data(){
        appThis=this;
        return {
            game: game,
            visual: []
        };
    },
    methods: {
        init(){
            console.log("app init");
            this.visual.autobuyerArray=[]
            this.Update();
        },
        ClickGainMoney(amount){
            ClickGainMoney(amount);
            this.Update();
        },
        Update(){
            this.visual.money = FormatValue(game.money);
            this.game.autobuyerArray.forEach((autobuyer, index) => {
                this.visual.autobuyerArray[index]={}
                this.visual.autobuyerArray[index].cost=FormatValue(autobuyer.cost);
                this.visual.autobuyerArray[index].interval=FormatValue(autobuyer.interval);
                this.visual.autobuyerArray[index].amount=FormatValue(autobuyer.amount);
                this.visual.autobuyerArray[index].intervalCost=FormatValue(autobuyer.intervalCost);
            });
            this.visual.autobuyerArray;
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
            this.Update()
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
    if(game.money.gte(10)) game.trigger.autoclicker = true;
    if(game.trigger.autoclicker){
        game.autobuyerArray[0] = autobuyerArray[0];
        appThis.Update();
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
setInterval(GameLoop, 100);