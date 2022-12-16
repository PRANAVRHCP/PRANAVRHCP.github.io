(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = 
  `<button type="button" id="newBTN"> Perf Helper </button>` ;   
 
  class PerformanceHelper extends HTMLElement {
      constructor() {
          super();
          // declare global variables to be used across the whole scope of this code
         window.steplog = [];
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
              }, 10);
              if(window.initval===0)
              {              
              initval =  window.sap.raptr.getEntries().filter(e => e.entryType === 'measure'  && e.name !=="(Table) Rendering").length ;    
             //  $('html').unbind('click');  
              };
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
      //Logic for widget derivation
      
      for(var i = 0 ; i< steplog.length ; i++)
    {   
        //Create list of Ina Calls  
        steplog[i].InaCall = steplog[i].stepsnapshot.filter(e => e.source == "external");
        //Create list of Render widget based on identifiers
        let st = steplog[i].stepsnapshot.filter(e => e.identifier != null && e.identifier !== '');
        st = st.filter(e => e.identifier.includes("render")); 
        //Append list of Render widget based on identifiers 
        steplog[i].Widgetinfo = st;        
    }
       console.log(steplog)   ; 
        }
  }

    
  customElements.define('pka-button02', PerformanceHelper);
})();



