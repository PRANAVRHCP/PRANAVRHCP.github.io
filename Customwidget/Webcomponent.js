(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<button type="button" id="myBtn" onclick="funcclear()"> Perf. Help </button>    
    <script>    
    function myFunction() {
      window.alert("here i am clicked");
    </script>`;
   
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
            measures = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure')            ;
            console.log(measures);
        }
        
        handleButtonClick() {        
        console.log('Here');
    }

        funcclear() {
            console.log("here");
        }       
    }

    customElements.define('pka-button', PerformanceHelp);
})();
