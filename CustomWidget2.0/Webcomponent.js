(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = 
  `<button type="button" id="newBTN"> Perf Helper </button>` ;   
 
  class PerformanceHelper extends HTMLElement {
      constructor() {
          super();
          // declare global variables to be used across the whole scope of this code
          window.steplog = [];
          window.dom_click = [];
          window.dom_content = [];
          window.sNo = 1;
          window.psNo = 0;
          window.x = [];         
          this.init();           
      }

      init() {            
          
         $(document).ready(function(){          
          $('html').click(async function(event){           
            
            //logic for step derivation 
            setTimeout(function() {
              
             if(event.target.tagName !== 'PKA-BUTTON02')
             {
              dom_click.push(event.target.parentNode.classList[0]);
              dom_content.push((event.target.parentElement).textContent);
              let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering" );
              lv_result = lv_result.sort(function(a, b){
                if(a.startTime < b.startTime) { return -1; }
                if(a.startTime > b.startTime) { return 1; }
                return 0;
            });
              let reslen = lv_result.length ;
            if(psNo!==reslen)
            {
            steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result })
            psNo = reslen ;
            sNo = sNo + 1; } }
             }, 10);
            
             await 1;
         }); });
           
          let shadowRoot = this.attachShadow({mode: "open"});
          shadowRoot.appendChild(tmpl.content.cloneNode(true));
          
          this.addEventListener("click", event => {
          var event = new Event("onClick");
          this.fireChanged();           
          this.dispatchEvent(event);
          });           
      }

      fireChanged() 
    {
      // Add the last step 
      
      this.addstep();
     
      //Logic for widget derivation
      
      for(var i = 0 ; i< steplog.length ; i++)
    {   
        //Create list of Ina Calls  
        steplog[i].InaCall = steplog[i].StepSnapshot.filter(e => e.source == "external");
        //Create list of Render widget based on identifiers
        let st = steplog[i].StepSnapshot.filter(e => e.identifier != null && e.identifier !== '');
        st = st.filter(e => e.identifier.includes("render")); 
        //Append list of Render widget based on identifiers 
        steplog[i].Widgetinfo = st;        
    }
       console.log(steplog)   ; 
        }
    
    addstep()
    {
         let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering" );
         lv_result = lv_result.sort(function(a, b){
                if(a.startTime < b.startTime) { return -1; }
                if(a.startTime > b.startTime) { return 1; }
                return 0;
            });
          let reslen = lv_result.length ;
            if(psNo!==reslen)
            {
            steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result })
            psNo = reslen ;
            sNo = sNo + 1; } 
    }
  }

    
  customElements.define('pka-button02', PerformanceHelper);
})();



