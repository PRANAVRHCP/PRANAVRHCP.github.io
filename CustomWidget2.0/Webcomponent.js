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
            //add the details about the event click trigger text 

            //logic for step derivation -> For initial step only , will run only once
            if(sNo == 1)  {
                  let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering" );
                      lv_result = lv_result.sort(function(a, b){
                        if(a.startTime < b.startTime) { return -1; }
                        if(a.startTime > b.startTime) { return 1; }
                        return 0;
              });
                let reslen = lv_result.length ;
              if(psNo!==reslen)
              {
              steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result  })
              psNo = reslen ;
              sNo = sNo + 1; } }
            
              // This is the usual flow for collecting steps -
              // there will be a delay in collecting for roughly 10 seconds

              setTimeout(function() 
              {              
                 // It will not be triggered when the user clicks the Performance Helper Button
                  if(event.target.tagName !== 'PKA-BUTTON02')
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
                  steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result  })
                  psNo = reslen ;
                  sNo = sNo + 1;             
                  } }
             }, 10000);            
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
      
      setTimeout(function()       
      { 
      
      //Check incase there are any new entries (most likely not)

      let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering" );
      lv_result = lv_result.sort(function(a, b){
             if(a.startTime < b.startTime) { return -1; }
             if(a.startTime > b.startTime) { return 1; }
             return 0;
         });
       let reslen = lv_result.length ;
         if(psNo!==reslen)
         {
         steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result})
         psNo = reslen ;
         sNo = sNo + 1; } 
      
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

      }, 10000);
   
    } // End of Fire Changed
  }

    
  customElements.define('pka-button02', PerformanceHelper);
})();



