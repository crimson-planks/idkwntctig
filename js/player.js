const OVERFLOW = new Decimal(Math.pow(2,31));
const INFINITY = new Decimal(Number.MAX_VALUE)
const ETERNITY  = new Decimal("1e9e15")
const VERSION = "0.0.2"
var game = {
    matter: new Decimal(0),
    matterPerSecond: new Decimal(),
    loseMatterPerSecond: new Decimal(),
    netMatterPerSecond: new Decimal(),
    defaultMatter: new Decimal(0),
    softReset0Cost: new Decimal(1000),
    defaultSoftReset0Cost: new Decimal(1000),
    reducedCost: new Decimal(0),
    clickGain: new Decimal(1),
    autobuyerArray: Array(),
    upgrade: Object(),
    trigger:{
        autobuyer: Array(3).fill(false),
        overflowForced: false,
        hasOverflown: false,
    },
    statistics:{
        deflation: new Decimal(0),
        overflow: new Decimal(0)
    },
    isBreakOverflow: false,
    overflowPoint: new Decimal(),
    notation: "scientific",
    isDevMode: false,
    createdVersion: VERSION,
    currentVersion: VERSION,
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
        type: "matter",
        tier: 0,
        interval: 1000,
        cost: new Decimal(10),
        costIncrease: new Decimal(5),
        intervalCost: new Decimal("100"),
        intervalCostIncrease: new Decimal("10"),
        active: true
    }),
    new Autobuyer({
        type: "matter",
        tier: 1,
        interval: 2000,
        cost: new Decimal(500),
        costIncrease: new Decimal(100),
        intervalCost: new Decimal("1000"),
        intervalCostIncrease: new Decimal("100"),
        active: true
    }),
    new Autobuyer({
        type: "matter",
        tier: 2,
        interval: 4000,
        cost: new Decimal("1e7"),
        costIncrease: new Decimal("1e6"),
        intervalCost: new Decimal("1e8"),
        intervalCostIncrease: new Decimal("1000"),
        active: true
    }),

];
var upgradeObject = {
    overflow:{
        matterPerClick: new Upgrade({
            type: "overflow",
            id: "matterPerClick",
            amount: new Decimal(),
            cost: new Decimal(1),
            costIncrease: new Decimal(1),
            value: new Decimal()
        }),
        
    }
}