let Money = new Decimal(0);
let OnClick = new Decimal(0.05);
let Level = new Decimal(1);
let NextLevelClicks = new Decimal(1e4);
let LevelMult = new Decimal(1);
let LevelExponent = new Decimal(2);
let LevelScaling = new Decimal(5);
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
    if (valDecimal.gte("1e16")) {
        const formatted = valDecimal.toExponential(2);
        const parts = formatted.split('e');
        parts[0] = parts[0].replace(/(\.\d)$/, '$10');
        return parts.join('e');
    } else if (valDecimal.gte(10000)) {
        const formattedValue = valDecimal.toExponential(2);
        if (!formattedValue.includes('.') && formattedValue.includes('e')) {
            const withoutPlus = formattedValue.replace(/e\+/, 'e');
            return withoutPlus.replace('e', '.00e');
        }
        return formattedValue.replace(/e\+/, 'e');
    } else {
        return RoundNum(valDecimal).toString();
    }
}

function AddClicks() {
    Money = Money.add(OnClick.times(LevelMult));
    document.getElementById("ClicksText").textContent = "$" + Format(Money) + " ("+Format(OnClick.times(LevelMult.times(100)))+"/s)";
    if (document.getElementById('Upgrade7').textContent == "Bought" && Money.gte(NextLevelClicks)) {
        Level = getBaseLog(LevelScaling,Money.div(1e4)).add(2).floor();
        LevelMult = LevelExponent.pow(Level.sub(1));
        NextLevelClicks = LevelScaling.pow(Level.sub(1)).times(1e4);
        document.getElementById('LevelText').textContent = "Level " + Format(Level) + " (x" + Format(LevelMult) + " money). Next level at $" + Format(NextLevelClicks);
    }
}

function Upgrade(Cost, amt, IDEN) {
    if (Money.gte(Cost) && document.getElementById(IDEN).textContent !== "Bought") {
        if (IDEN === 'Upgrade7') {
            document.getElementById('LevelText').textContent = "Level 1 (x1 clicks). Next level at 1e4 Clicks";
        }
        if (IDEN === 'Upgrade9' || IDEN == "Upgrade12" || IDEN == "Upgrade16") {
            LevelExponent = LevelExponent.add(amt);
            LevelMult = LevelExponent.pow(Level.sub(1));
            document.getElementById('LevelText').textContent = "Level " + Format(Level) + " (x" + Format(LevelMult) + " money). Next level at $" + Format(NextLevelClicks);
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

// Start the loop
Loop();
