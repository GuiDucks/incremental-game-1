let UpgradeAmt = 209;
let Money = new Decimal('0');
let TotalMoney = new Decimal('0')
let Energy = new Decimal('0');
let SEnergy = new Decimal('0');
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
let SEnergyMult = new Decimal(1);
let SEnergyExpo = new Decimal(2);
let SEnergyEMult = new Decimal(1);
let SEnergyEBoost = new Decimal(1);
let SenergyEExpo = new Decimal(0.0045);
function loadGameData() {
    Money = new Decimal(localStorage.getItem('Money')) || new Decimal('0');
    TotalMoney = Money
    Energy = new Decimal(localStorage.getItem('Energy')) || new Decimal('0');
    SEnergy = new Decimal(localStorage.getItem('SEnergy')) || new Decimal('0');
    setTimeout(BuyMax, 0);
}
function saveGameData() {
    localStorage.setItem('Money', TotalMoney.toString());
    localStorage.setItem('Energy', Energy.toString());
    localStorage.setItem('SEnergy', SEnergy.toString());
}
window.onload = function() {
    loadGameData();
    Loop();
};
function pow10(vall,tier = null) {
    const val = new Decimal(vall);
    if (tier == null) {
        return new Decimal('10').pow(vall);
    } else {
        return (Decimal.tetrate(10,tier)).pow(val)
    }
}
setInterval(saveGameData, 5000);

window.addEventListener('beforeunload', saveGameData);
function getBaseLog(base, value) {
    const baseDecimal = new Decimal(base);
    const valueDecimal = new Decimal(value);
    const result = valueDecimal.log(baseDecimal);
    return result;
}
function RoundNum(Val) {
    const valDecimal = new Decimal(Val);
    return valDecimal.times(10).ceil()/10;
}
function Format(Val) {
    const valDecimal = new Decimal(Val);
    if (valDecimal.gte('1e1000000')) {
        return "e" + Format(getBaseLog(10,valDecimal))
    } else if (valDecimal.gte('1e1000')) {
        const parts = valDecimal.toExponential(0).split('e');
        const coefficient = parts[0] === "10" ? "1" : parts[0];
        return coefficient + 'e' + getBaseLog(10,valDecimal).add(0.01).floor().toString();
    } else if (valDecimal.gte(1000000) && valDecimal.lt('1e1000')) {
        const formatted = valDecimal.toExponential(2);
        const parts = formatted.split('e');
        parts[0] = parts[0].includes('.') ? parts[0].padEnd(4, '0') : parts[0] + '.00';
        parts[1] = parts[1].replace(/\+/, '');
        return parts.join('e');
    } else if (valDecimal.lt('1e3')) {
        return RoundNum(valDecimal).toString();
    } else {
        return valDecimal.floor().toString(); 
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
    document.getElementById('SLevelText').textContent = "Super Level " + Format(SLevel) + " (x" + Format(SLevelMult) + " money).";
    if (SLevel.lt(100000)) {
        document.getElementById('SLevelText').textContent = document.getElementById('SLevelText').textContent + " Next Slevel at $" + Format(NextSLevelMoney);
    }
}
function AddClicks() {
    Money = Money.add(OnClick.times(LevelMult.times(SLevelMult.times(SelfMoneyBoost.times(EnergyMonMult)))));
    TotalMoney = TotalMoney.add(OnClick.times(LevelMult.times(SLevelMult.times(SelfMoneyBoost.times(EnergyMonMult)))));
    document.getElementById("ClicksText").textContent = "$" + Format(Money);
    if (Money.lt('1e100000')) {
        document.getElementById("ClicksText").textContent = document.getElementById("ClicksText").textContent  + " (" + Format(OnClick.times(LevelMult.times(70).times(SLevelMult.times(SelfMoneyBoost.times(EnergyMonMult))))) + "/s)";
    }
    if (document.getElementById('Upgrade7').textContent == "Bought" && Money.gte(NextLevelClicks)) {
       CalculateLevel();
    }
    if (document.getElementById('Upgrade27').textContent == "Bought" && Money.gte(NextSLevelMoney)) {
        CalculateSLevel();
    }
    if (document.getElementById('Upgrade69').textContent == "Bought") {
        Energy = Energy.add(EnergyMult.times(MonEnergyMult).times(SEnergyEMult));
        EnergyMonMult = Energy.pow(EnergyExpo);
        document.getElementById('EnergyText').textContent = "Energy: " + Format(Energy) + " (x" + Format(EnergyMonMult) + " Money)"
    }
    if (document.getElementById('Upgrade131').textContent == "Bought") {
        SEnergy = SEnergy.add(SEnergyMult.times(SEnergyEBoost));
        SEnergyEMult = SEnergy.pow(SEnergyExpo);
        document.getElementById('SEnergyText').textContent = "Super Energy: " + Format(SEnergy) + " (x" + Format(SEnergyEMult) + " Energy)"
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
    if (document.getElementById('Upgrade142').textContent !== "S Energy receives a multiplier based on energy; $1e285000" && Energy.gte("1e2600")) {
        SEnergyEBoost = (Energy.div("1e2500")).pow(SenergyEExpo);
        document.getElementById('Upgrade142').textContent = "Currently: x" + Format(SEnergyEBoost);
    } else {
        SEnergyEBoost = 1;
    }
}

function Upgrade(Costt, amt, IDEN, UpgType = 0,tier = 0) {
    let Cost = new Decimal(Costt);
    if (tier >= 0.5) {
        Cost = pow10(Costt,tier);
    }
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
        } else if(UpgType === 7) {
            SEnergyMult = SEnergyMult.add(amt);
        } else if(UpgType === 8) {
            SEnergyExpo = SEnergyExpo.add(amt);
        } else if(UpgType === 9) {
            SenergyEExpo = SenergyEExpo.add(amt);
        } else {
            OnClick = OnClick.times(amt);
        }
        Money = Money.sub(Cost);
        document.getElementById(IDEN).textContent = "Bought";
    }
}
function BuyMax() {
    for (let i = 1; i <= UpgradeAmt; i++) {
        document.getElementById("Upgrade"+i).click();
    }
}
function Loop() {
    AddClicks();
    setTimeout(Loop, 10);
}
