let Clicks = 0;
let OnClick = 1;
function Format(Val) {
    if (Val >= 1e3) {
        return Math.floor(Val*100/Math.pow(10,Math.floor(Math.log10(Val))))/100 + "e" + Math.floor(Math.log10(Val))
    } else {
        return Val
    }
}
function AddClicks() {
    Clicks += OnClick
    document.getElementById("ClicksText").textContent = "Clicks: " + Format(Clicks)
}
function Upgrade(Cost,amt,IDEN) {
    if (Clicks >= Cost && !(document.getElementById(IDEN).textContent == "Bought")) {
        OnClick += amt
        document.getElementById("ClickButton").textContent = "Click for +" + Format(OnClick)
        document.getElementById(IDEN).textContent = "Bought"
        Clicks -= Cost
        document.getElementById("ClicksText").textContent = "Clicks: " + Format(Clicks)
    }
}