import Decimal from "./break_eternity";
import { Autobuyer } from "./autobuyer";
import { NotationOption , Notation} from "./format";

export const OVERFLOW = new Decimal(Math.pow(2,31));
export const INFINITY = new Decimal(Number.MAX_VALUE)
export const ETERNITY  = new Decimal("1e9e15")
export const VERSION = "0.0.1"
export var game: {
    matter: Decimal;
    defaultMatter: Decimal;
    softReset0Cost: Decimal;
    defaultSoftReset0Cost: Decimal;
    reducedCost: Decimal;
    trigger: {
        autobuyer: boolean[];
        overflowForced: boolean;
    };
    statistics:{
        deflation: Decimal;
        overflow: Decimal;
    };
    isBreakOverflow: boolean;
    overflowPoint: Decimal;
    isDevMode: boolean;
    createdVersion: string;
    currentVersion: string;
    lastSaved: number;
    lastUpdated: number;
    autobuyerArray: Autobuyer[];
    notation: Notation;
    notationOption: Record<Notation, NotationOption>;
} = {
    matter: new Decimal(0),
    defaultMatter: new Decimal(0),
    softReset0Cost: new Decimal(1000),
    defaultSoftReset0Cost: new Decimal(1000),
    reducedCost: new Decimal(0),
    trigger:{
        autobuyer: Array(3),
        overflowForced: false
    },
    statistics:{
        deflation: new Decimal(0),
        overflow: new Decimal(0)
    },
    isBreakOverflow: false,
    overflowPoint: new Decimal(),
    isDevMode: false,
    createdVersion: VERSION,
    currentVersion: VERSION,
    lastSaved: Date.now(),
    lastUpdated: Date.now(),
    autobuyerArray: [],
    notation: "scientific",
    notationOption: {
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
    },
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
        active: true,
        amount: 0,
        bought: 0,
        timer: 0
    }),
    new Autobuyer({
        type: 0,
        tier: 1,
        interval: 2000,
        cost: new Decimal(200),
        costIncrease: new Decimal(500),
        intervalCost: new Decimal("1000"),
        intervalCostIncrease: new Decimal("100"),
        active: true,
        amount: 0,
        bought: 0,
        timer: 0
    }),
    new Autobuyer({
        type: 0,
        tier: 2,
        interval: 4000,
        cost: new Decimal("1e7"),
        costIncrease: new Decimal("1e6"),
        intervalCost: new Decimal("1e8"),
        intervalCostIncrease: new Decimal("1000"),
        active: true,
        amount: 0,
        bought: 0,
        timer: 0
    }),

];