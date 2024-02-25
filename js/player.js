const OVERFLOW = new Decimal(Math.pow(2,31));
const INFINITY = new Decimal(Number.MAX_VALUE)
const ETERNITY  = new Decimal("1e9e15")
const VERSION = "0.0.3"
/** variables that aren't saved */
var variables={
    matterPerSecond: new Decimal(),
    loseMatterPerSecond: new Decimal(),
    netMatterPerSecond: new Decimal(),
    playTime: 0,
    deflationTime: 0,
    overflowTime: 0,
    canPress:{
        m: true
    }
};
const tabs = ["autobuyer","overflow","option","statistics"]
const subTabs = {
    "autobuyer": ["matter","deflation","overflow"],
    "overflow": ["upgrade","energy"],
    "option": ["saving", "visual"],
    "statistics": ["general"]
}
/** variables that are saved */
var game = {
    matter: new Decimal(0),
    defaultMatter: new Decimal(0),
    softReset0Cost: new Decimal(1000),
    defaultSoftReset0Cost: new Decimal(1000),
    reducedCost: new Decimal(0),
    clickGain: new Decimal(1),
    deflation: new Decimal(),
    deflationPower: new Decimal(),
    autobuyerObject: {
        matter: [],
    },
    deflator: new Decimal(),
    upgrade: {},
    tab: {
        autobuyer: {
            unlocked: true
        },
        overflow: {
            unlocked: false
        },
        option: {
            unlocked: true
        },
        statistics: {
            unlocked: true
        }
    },
    subTab: {
        autobuyer: {
            matter: {unlocked: true},
        },
        overflow: {
        },
        option: {
            saving: {unlocked: true}
        },
        statistics: {
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
    overflowLimit: OVERFLOW,
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
tabs.forEach((tab)=>{game.subTab[tab]=subTabs[tab]});
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
const notationArray = [
    "scientific", "engineering", "logarithm", "engineering-alt", "letters","emoji", "inequality"
]