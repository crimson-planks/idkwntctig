function init(){
    TriggerInit();
    load();
    appThis.init();
    document.getElementById("loading").setAttribute("style", "display: none");
    document.getElementById("app").setAttribute("style", "display: block;");
}