const OVERFLOW = new Decimal(Math.pow(2,31));
const INFINITY = new Decimal(Number.MAX_VALUE)
const ETERNITY  = new Decimal("1e9e15")
const VERSION = "0.0.3"
var variables={
    matterPerSecond: new Decimal(),
    loseMatterPerSecond: new Decimal(),
    netMatterPerSecond: new Decimal(),
    playTime: 0,
    deflationTime: 0,
    overflowTime: 0,
};
var game = {
    matter: new Decimal(0),
    defaultMatter: new Decimal(0),
    softReset0Cost: new Decimal(1000),
    defaultSoftReset0Cost: new Decimal(1000),
    reducedCost: new Decimal(0),
    clickGain: new Decimal(1),
    deflation: new Decimal(),
    autobuyerObject: {
        matter: []
    },
    upgrade: Object(),
    tab: {
        autobuyer: {
            name: "Autobuyers",
            unlocked: true
        },
        overflow: {
            name: "Overflow",
            unlocked: false
        },
        option: {
            name: "Options",
            unlocked: true
        },
        statistics: {
            name: "Statistics",
            unlocked: true
        }
    },
    trigger:{
        autobuyer: Array(3).fill(false),
        overflowForced: false,
        overflowReset: false,
    },
    statistics:{
        matterProduced: new Decimal(),
        deflation: new Decimal(0),
        overflow: new Decimal(0),
        fastestOverflowTime: Infinity,
    },
    isBreakOverflow: false,
    overflowPoint: new Decimal(),
    notation: "scientific",
    isDevMode: false,
    createdVersion: VERSION,
    currentVersion: VERSION,
    createdTime: Date.now(),
    lastDeflationTime: Date.now(),
    lastOverflowTime: Date.now(),
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
var autobuyerObject={
    matter: [
        new Autobuyer({
            type: "matter",
            tier: 0,
            initialInterval: 1000,
            currencyType: "matter",
            cost: new LinearCost({
                currencyType: "matter",
                cost: new Decimal(10),
                costIncrease: new Decimal(5)
            }),
            intervalCost: new ExponentialCost({
                currencyType: "matter",
                cost: new Decimal(100),
                costIncrease: new Decimal(10)
            }),
            active: true
        }),
        new Autobuyer({
            type: "matter",
            tier: 1,
            initialInterval: 2000,
            currencyType: "matter",
            cost: new LinearCost({
                currencyType: "matter",
                cost: new Decimal(500),
                costIncrease: new Decimal(100)
            }),
            intervalCost: new ExponentialCost({
                currencyType: "matter",
                cost: new Decimal(1000),
                costIncrease: new Decimal(100)
            }),
            active: true
        }),
        new Autobuyer({
            type: "matter",
            tier: 2,
            initialInterval: 4000,
            currencyType: "matter",
            cost: new LinearCost({
                currencyType: "matter",
                cost: new Decimal("1e7"),
                costIncrease: new Decimal("1e6")
            }),
            intervalCost: new ExponentialCost({
                currencyType: "matter",
                cost: new Decimal("1e8"),
                costIncrease: new Decimal("1000")
            }),
            active: true
        })
    ]
};
var notationArray = [
    "scientific", "engineering"
]
var upgradeObject = {
    overflow:{
        matterPerClick: new Upgrade({
            type: "overflow",
            id: "matterPerClick",
            amount: new Decimal(),
            cost: new Decimal(1),
            costIncrease: new Decimal(1),
            value: new Decimal(),
        }),
        startAutoclicker: new Upgrade({
            type: "overflow",
            id: "startAutoclicker",
            amount: new Decimal(),
            cost: new Decimal(1),
            costIncrease: new Decimal(0),
            value: new Decimal(),
        }),
        overflowTimeMultiplier: new Upgrade({
            type: "overflow",
            id: "overflowTimeMultiplier",
            amount: new Decimal(),
            cost: new Decimal(2),
            costIncrease: Decimal.dInf,
            value: new Decimal(),
        })
    }
}