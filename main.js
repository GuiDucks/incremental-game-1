let Money = new Decimal('0');
let Energy = new Decimal('0');
// ENDGAME: e34500 and 1e342 Energy
let OnClick = new Decimal(0.05);
let Level = new Decimal(1);
let SLevel = new Decimal(1);
let NextLevelClicks = new Decimal(1e4);
let NextSLevelMoney = new Decimal(1e58);
let LevelMult = new Decimal(1);
let SLevelMult = new Decimal(1);
let LevelExponent = new Decimal(2);
let SLevelExponent = new Decimal(3);
let LevelScaling = new Decimal(5);
let SLevelScaling = new Decimal(1.025);
let MaxLevel = new Decimal(100);
let SelfMoneyPow = new Decimal(0.35);
let SelfMoneyBoost = new Decimal(1);
let EnergyExpo = new Decimal(5);
let EnergyMult = new Decimal(1);
let EnergyMonMult = new Decimal(1);
let MonEnergyMult = new Decimal(1);
let MonEnergyExpo = new Decimal(0.01);
const ten = new Decimal(10);
function getBaseLog(base, value) {
    // Convert the base and value to Decimal objects
    const baseDecimal = new Decimal(base);
    const valueDecimal = new Decimal(value);

    // Calculate the logarithm using break_eternity.js
    const result = valueDecimal.log(baseDecimal);

    // Return the result as a Decimal object
    return result;
}
function RoundNum(Val) {
    const valDecimal = new Decimal(Val);
    return valDecimal.times(100).ceil()/100;
}
function Format(Val) {
    const valDecimal = new Decimal(Val);
    if (valDecimal.gte('1e1000')) {
        const parts = valDecimal.toExponential(0).split('e');
        const coefficient = parts[0] === "10" ? "1" : parts[0];
        return coefficient + 'e' + getBaseLog(10,valDecimal).add(0.01).floor().toString();
    } else if (valDecimal.gte(10000) && valDecimal.lt('1e1000')) {
        const formatted = valDecimal.toExponential(2);
        const parts = formatted.split('e');
        parts[0] = parts[0].includes('.') ? parts[0].padEnd(4, '0') : parts[0] + '.00';
        parts[1] = parts[1].replace(/\+/, '');
        return parts.join('e');
    } else {
        return RoundNum(valDecimal).toString();
    }
}
function CalculateLevel() {
    Level = getBaseLog(LevelScaling, Money.div(1e4)).add(2).floor();
    if (Level.gte(MaxLevel)) {
        LevelMult = LevelExponent.pow(MaxLevel.sub(1)).times(LevelExponent.pow(Level.sub(101)).pow(0.25))
    } else {
        LevelMult = LevelExponent.pow(Level.sub(1));
    }
    NextLevelClicks = LevelScaling.pow(Level.sub(1)).times(1e4);
    document.getElementById('LevelText').textContent = "Level " + Format(Level) + " (x" + Format(LevelMult) + " money)";
    if (Level.lt('1e4')) {
        document.getElementById('LevelText').textContent = document.getElementById('LevelText').textContent + " Next level at $" + Format(NextLevelClicks)
        if (Level.gte(MaxLevel)) {
            document.getElementById('LevelText').textContent = document.getElementById('LevelText').textContent + " [SOFT CAPPED]"
        }
    }
}
function CalculateSLevel() {
    SLevel = getBaseLog(SLevelScaling,getBaseLog(10,Money).div(58)).add(2).floor();
    NextSLevelMoney = ten.pow(new Decimal(58).times(SLevelScaling.pow(SLevel.sub(1))));
    SLevelMult = SLevelExponent.pow(SLevel.sub(1));
    document.getElementById('SLevelText').textContent = "Super Level " + Format(SLevel) + " (x" + Format(SLevelMult) + " money). Next Slevel at $" + Format(NextSLevelMoney);
}
function AddClicks() {
    Money = Money.add(OnClick.times(LevelMult.times(SLevelMult.times(SelfMoneyBoost.times(EnergyMonMult)))));
    document.getElementById("ClicksText").textContent = "$" + Format(Money) + " (" + Format(OnClick.times(LevelMult.times(100).times(SLevelMult.times(SelfMoneyBoost.times(EnergyMonMult))))) + "/s)";
    if (document.getElementById('Upgrade7').textContent == "Bought" && Money.gte(NextLevelClicks)) {
       CalculateLevel();
    }
    if (document.getElementById('Upgrade27').textContent == "Bought" && Money.gte(NextSLevelMoney)) {
        CalculateSLevel();
    }
    if (document.getElementById('Upgrade69').textContent == "Bought") {
        Energy = Energy.add(EnergyMult.times(MonEnergyMult));
        EnergyMonMult = Energy.pow(EnergyExpo);
        document.getElementById('EnergyText').textContent = "Energy: " + Format(Energy) + " (x" + Format(EnergyMonMult) + " Money)"
    }
    if (document.getElementById('Upgrade41').textContent !== "Money receives a multiplier based on itself; $1e180" && Money.gte("1e180")) {
        SelfMoneyBoost = (Money.div("1e180")).pow(SelfMoneyPow)
        document.getElementById('Upgrade41').textContent = "Currently: x" + Format(SelfMoneyBoost)
    }
    if (document.getElementById('Upgrade83').textContent !== "Energy receives a multiplier based on Money; $1e2200" && Money.gte("1e2000")) {
        MonEnergyMult = (Money.div("1e2000")).pow(MonEnergyExpo);
        document.getElementById('Upgrade83').textContent = "Currently: x" + Format(MonEnergyMult);
    } else {
        MonEnergyMult = 1;
    }
}

function Upgrade(Cost, amt, IDEN, UpgType = 0) {
    if (Money.gte(Cost) && document.getElementById(IDEN).textContent !== "Bought") {
        if (IDEN === 'Upgrade7') {
            document.getElementById('LevelText').textContent = "Level 1 (x1 Money). Next level at $1e4";
        }
        if (IDEN === 'Upgrade27') {
            document.getElementById('SLevelText').textContent = "Level 1 (x1 Money). Next level at $1e58";
        }
        if (IDEN === 'Upgrade9' || IDEN == "Upgrade12" || IDEN == "Upgrade16" || IDEN == "Upgrade19"|| IDEN == "Upgrade23") {
            LevelExponent = LevelExponent.add(amt);
           CalculateLevel();
            document.getElementById('LevelText').textContent = "Level " + Format(Level) + " (x" + Format(LevelMult) + " money). Next level at $" + Format(NextLevelClicks);
        } else if(UpgType === 1) {
            SLevelExponent = SLevelExponent.times(amt);
            SLevelMult = SLevelExponent.pow(SLevel.sub(1));
            document.getElementById('SLevelText').textContent = "Super Level " + Format(SLevel) + " (x" + Format(SLevelMult) + " money). Next Slevel at $" + Format(NextSLevelMoney);
        } else if(UpgType === 2) {
            MaxLevel = MaxLevel.add(amt);
            CalculateLevel();
        } else if(UpgType === 3) {
            SLevelScaling = (SLevelScaling.sub(1)).div(amt).add(1)
            CalculateSLevel();
        } else if(UpgType === 4) {
            SelfMoneyPow = SelfMoneyPow.add(amt);
        } else if(UpgType === 5) {
            EnergyMult = EnergyMult.times(amt);
        } else if(UpgType === 6) {
            EnergyExpo = EnergyExpo.add(amt);
        } else {
            OnClick = OnClick.times(amt);
        }
        Money = Money.sub(Cost);
        document.getElementById(IDEN).textContent = "Bought";
    }
}
function Loop() {
    AddClicks();
    setTimeout(Loop, 10);
}
Loop();
