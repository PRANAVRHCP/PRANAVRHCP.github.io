(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = 
  `<button type="button" id="newBTN"> Perf Helper </button>` ;   
 
  class PerformanceHelper extends HTMLElement {
      constructor() {
          super();
          // declare global variables to be used across the whole scope of this code
          window.initval = 0;
          window.x = [];
          this.init();           
      }

      init() {            
          
         $(document).ready(function(){          
          $('html').click(async function(event){
            //do a delay   
            setTimeout(function() {
               console.log('delay done,did it impact the exec?');
              }, 10000);
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
      //Logic for step derivation
      result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering" );
      result = result.sort(function(a, b){
          if(a.startTime < b.startTime) { return -1; }
          if(a.startTime > b.startTime) { return 1; }
          return 0;
      });
      var z = [0];
      var x = [];
      var currentStepTime = 0;
      var previousStepTime = 0;
      previousStepTime = result[initval-1].startTime;
      //Generate list of steps
      for (var i = initval ; i< result.length ; i++)
              {
                 currentStepTime = result[i].startTime ;           
                 var diff = currentStepTime - previousStepTime;   
                  previousStepTime = currentStepTime ;          

          if(diff > 1000 && result[i].source !== 'external' )
          { 
             z.push(i);
          }
          else if(diff > 1000 && result[i].source === 'external' )
                  {
                       previousStepTime = 0 ; 
                  }
              }

      z.push(result.length);{

      }

      let stepNo = 1;
      let stepDuration = 0;
      let maxstepid = 0 ;
      let endTime = 0;

      for (var y = 1 ; y < z.length ; y++)
          {
              let maxEndTime = 0;
              for (var i = z[y-1] ; i < z[y] ; i++ )
                  {
                       endTime = result[i].startTime + result[i].duration;
                         if (endTime > maxEndTime &&  result[i].source !== 'external')
                         {      
                            maxEndTime = endTime ;
                             maxstepid = i ;
                         }  
                  }
              var lv_startid = z[y-1] ; 
              stepDuration = maxEndTime -  result[lv_startid].startTime;   
              if( y == 1)
              {
                 x.push({StepNo:stepNo , StepDuration:stepDuration.toFixed(2) , LogStepStartID: lv_startid , LogMaxStepID : maxstepid  , StepDetail : 'Initialization'})

              }
              else
              {
                  x.push({StepNo:stepNo , StepDuration:stepDuration.toFixed(2) , LogStepStartID: lv_startid , LogMaxStepID : maxstepid  , StepDetail : result[lv_startid].name })

              }
                     stepNo = stepNo + 1;
          }
        console.log(result);
        console.log(x);
    }  
  }

    
  customElements.define('pka-button02', PerformanceHelper);
})();


/*(function () {
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
           
            let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering" );
            lv_result = lv_result.sort(function(a, b){
                if(a.startTime < b.startTime) { return -1; }
                if(a.startTime > b.startTime) { return 1; }
                return 0;
            });

            steplog.push({StepNo:sNo , StepStartID: psNo ,StependID: lv_result.length - 1 , steplog:lv_result.slice(psNo, lv_result.length)})
            psNo = lv_result.length;
            sNo = sNo + 1;              
            //await 1;
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
      //Logic for step derivation
      result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering" );
      result = result.sort(function(a, b){
          if(a.startTime < b.startTime) { return -1; }
          if(a.startTime > b.startTime) { return 1; }
          return 0;
      });
      var z = [0];
      var x = [];
      var currentStepTime = 0;
      var previousStepTime = 0;
      previousStepTime = result[initval-1].startTime;
      //Generate list of steps
      for (var i = initval ; i< result.length ; i++)
              {
                 currentStepTime = result[i].startTime ;           
                 var diff = currentStepTime - previousStepTime;   
                  previousStepTime = currentStepTime ;          

          if(diff > 1000 && result[i].source !== 'external' )
          { 
             z.push(i);
          }
          else if(diff > 1000 && result[i].source === 'external' )
                  {
                       previousStepTime = 0 ; 
                  }
              }

      z.push(result.length);{

      }

      let stepNo = 1;
      let stepDuration = 0;
      let maxstepid = 0 ;
      let endTime = 0;

      for (var y = 1 ; y < z.length ; y++)
          {
              let maxEndTime = 0;
              for (var i = z[y-1] ; i < z[y] ; i++ )
                  {
                       endTime = result[i].startTime + result[i].duration;
                         if (endTime > maxEndTime &&  result[i].source !== 'external')
                         {      
                            maxEndTime = endTime ;
                             maxstepid = i ;
                         }  
                  }
              var lv_startid = z[y-1] ; 
              stepDuration = maxEndTime -  result[lv_startid].startTime;   
              if( y == 1)
              {
                 x.push({StepNo:stepNo , StepDuration:stepDuration.toFixed(2) , LogStepStartID: lv_startid , LogMaxStepID : maxstepid  , StepDetail : 'Initialization'})

              }
              else
              {
                  x.push({StepNo:stepNo , StepDuration:stepDuration.toFixed(2) , LogStepStartID: lv_startid , LogMaxStepID : maxstepid  , StepDetail : result[lv_startid].name })

              }
                     stepNo = stepNo + 1;
          }
        console.log(result);
        console.log(x);
    }  
  }

    
  customElements.define('pka-button02', PerformanceHelper);
})();*/
