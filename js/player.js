var game = {
    matter: new Decimal(0),
    defaultMoney: new Decimal(0),
    autobuyerArray: [],
    trigger:{
        autoclicker: false,
        autobuyer1: false
    },
    notation: "scientific",
    lastSaved: Date.now(),
    lastUpdated: Date.now()
};
game.notationOption = {
    general: {
        dec: 3,
        smallDec: 2,
        maxBeforeNotate: 6,
        maxBeforeNegativePowerNotate: 2,
        subMaxBeforeNotate: 9,
        subMaxBeforeNegativePowerNotate: 9,
        maxExp: 9,
        expDec: 0,
        maxNotatedLayer: 4,
        customNegative: false,
        negativeSign: '-',
        customNegativeExp: false,
        extraDigit: 0,
        hExpDec: 4,
        powerTower: false,
        base: 10,
        htmlSafe: true,
        maxFullShow: 7,
        show: 7,
        maxNotatedBracketCount: 3,
        subNotationArray: ['_same']
    },
    logarithm: {
        expDec: 2
    },
    roman: {
        altFractions: false
    },
    inequality: {
        smallDec: 4,
        dec: 4,
        maxBeforeNotate: 15,
        maxBeforeNegativePowerNotate: 4,
        base: 3
    },
    seximal: {
        base: 6,
        maxBeforeNotate: 4,
        dec: 3,
        smallDec: 3
    }
};
var defaultGame = jQuery.extend({},game)
var autobuyerArray=[
    new Autobuyer({
        type: 0,
        tier: 0,
        interval: 1000,
        cost: new Decimal(10),
        costIncrease: new Decimal(5),
        intervalCost: new Decimal("100"),
        intervalCostIncrease: new Decimal("10"),
        active: true
    }),
    new Autobuyer({
        type: 0,
        tier: 1,
        interval: 2000,
        cost: new Decimal(100),
        costIncrease: new Decimal(20),
        intervalCost: new Decimal("100"),
        intervalCostIncrease: new Decimal("10"),
        active: true
    }),

]
