(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = 
  `<button type="button" id="newBTN"> Perf Helper </button>` ;   
 
  class PerformanceHelper extends HTMLElement {
      constructor() {
          super();
          // declare global variables to be used across the whole scope of this code
          window.y = 0;
          window.x = [];
          this.init();           
      }

      init() {            
          
         $(document).ready(function(){          
          $('html').click(function(event){
              if(window.y===0)
              {              
              y =  window.sap.raptr.getEntries().filter(e => e.entryType === 'measure').length ;               
              };
         }); 
          if(window.y!=0)
          {$('html').unbind('click');}
         });            

          let shadowRoot = this.attachShadow({mode: "open"});
          shadowRoot.appendChild(tmpl.content.cloneNode(true));
          
          this.addEventListener("click", event => {
          var event = new Event("onClick");
          this.fireChanged();           
          this.dispatchEvent(event);
          });           
      }

      fireChanged() {}}

    
  customElements.define('pka-button02', PerformanceHelper);
})();
