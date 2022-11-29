(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<button type="button" id="myBtn" src = "https://pranavrhcp.github.io/Customwidget/perfdashboard.png"> Perf. Help </button>` ;   
   
    class PerformanceHelp extends HTMLElement {
        constructor() {
            super();
            this.init();           
        }

        init() {            
              
            let shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.addEventListener("click", event => {
            var event = new Event("onClick");
            this.fireChanged();           
            this.dispatchEvent(event);
            });           
        }

        fireChanged() {
            console.log("OnClick Triggered");      
            var measures = window.sap.raptr.getEntries();
            var exportName = 'RaptrMeasures_' +  Date.now().toString() + '.json';
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(measures));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", exportName);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            console.log(measures);
        }        
        
    }

    customElements.define('pka-button', PerformanceHelp);
})();
