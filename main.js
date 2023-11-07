let Clicks = 0;
let OnClick = 1;
let Level = 1;
let NextLevelClicks = 1e4;
let LevelMult = 1;
function Format(Val) {
    if (Val >= 1e3) {
        return Math.floor(Val*100/Math.pow(10,Math.floor(Math.log10(Val))))/100 + "e" + Math.floor(Math.log10(Val))
    } else {
        return Val
    }
}
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }  
function AddClicks() {
    Clicks += OnClick*LevelMult
    document.getElementById("ClicksText").textContent = "Clicks: " + Format(Clicks)
    if (document.getElementById('Upgrade7').textContent == "Bought" && Clicks>=NextLevelClicks) {
        Level = Math.floor(getBaseLog(5,Clicks/1e4))+2
        LevelMult = Math.pow(2,Level-1)
        NextLevelClicks = Math.pow(5,Level-1)*1e4
        document.getElementById('LevelText').textContent = "Level " + Level +  " (x"+Format(LevelMult)+" clicks). Next level at "+Format(NextLevelClicks)+" Clicks"
        document.getElementById("ClickButton").textContent = "Click for +" + Format(OnClick*LevelMult)
    }
}
function Upgrade(Cost,amt,IDEN) {
    if (Clicks >= Cost && !(document.getElementById(IDEN).textContent == "Bought")) {
        if (IDEN == 'Upgrade7') {
            document.getElementById('LevelText').textContent = "Level 1 (x1 clicks). Next level at 1e4 Clicks"
        }
        OnClick += amt
        document.getElementById("ClickButton").textContent = "Click for +" + Format(OnClick*LevelMult)
        document.getElementById(IDEN).textContent = "Bought"
        Clicks -= Cost
        document.getElementById("ClicksText").textContent = "Clicks: " + Format(Clicks)
    }
}