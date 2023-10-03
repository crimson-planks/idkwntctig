/** Class representing a generic upgrade*/
class Upgrade {
    /**
     * 
     * @param {Object} props 
     */
    constructor(props) {
        this.type = props.type;
        this.id = props.id;
        this.amount = new Decimal(props.amount);
        this.cost = new Decimal(props.cost);
        this.costIncrease = new Decimal(props.costIncrease);
        this.value = new Decimal(props.value);
    }
    CanBuyOnce(money) {
        if(money.gte(this.cost)) return true;
        return false;
    }
    CanBuy(amount) {
        
    }
    BuyOnce() {
        //validation
        let currency = new Decimal()
        if(this.type==="overflow") currency = game.overflowPoint;
        if(this.type==="infinity");
        if(!this.CanBuyOnce(currency)) return;
        this.value = this.value.add(1);
        if(this.type==="overflow") game.overflowPoint = game.overflowPoint.minus(this.cost);
        if(this.type==="infinity");
        
    }
    Buy() {

    }
    toStringifiableObject() {
        return {
            _type: "Upgrade"
        }
    }
}