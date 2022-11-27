(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<button type="button" id="myBtn"> Perf. Help </button>    
    <script>
    document.getElementById("id").onclick = function() {myFunction()};
    function myFunction() {
      console.log("here");
    </script>`;
   
    class PerformanceHelp extends HTMLElement {
        constructor() {
            super();
            this.init();           
        }

        init() {            
               this.appendChild(tmpl.content.cloneNode(true)); 
            //const element = this.document.getElementById("myBtn");
            //element.addEventListener("click", handleButtonClick).bind(this);
           // this.buttonBoundListener = this.handleButtonClick.bind(this);
        }

        fireChanged() {
            console.log("OnClick Triggered");            
        }
        
        handleButtonClick() {        
        console.log('Here');
    }

        clear() {
            console.log("");
        }       
    }

    customElements.define('pka-button', PerformanceHelp);
})();
