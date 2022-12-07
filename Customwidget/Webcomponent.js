(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = 
  `<button type="button" id="myBtn"> Perf. Help </button>` ;   
 
  class PerformanceHelp extends HTMLElement {
      constructor() {
          super();
          // declare global variables to be used across the whole scope of this code
          window.y = [];
          window.x = [];
          this.init();           
      }

      init() {            
          
         $(document).ready(function(){          
          $('html').click(function(event){
              //if(window.y===0)
              //{              
              y.push( window.sap.raptr.getEntries().filter(e => e.entryType === 'measure').length) ; //};
         });              
         });            

          let shadowRoot = this.attachShadow({mode: "open"});
          shadowRoot.appendChild(tmpl.content.cloneNode(true));
          
          this.addEventListener("click", event => {
          var event = new Event("onClick");
          this.fireChanged();           
          this.dispatchEvent(event);
          });           
      }

      fireChanged() {
          
          //Retrieve the Log  for all the steps
          
          let result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure');
          //Sort
          result = result.sort(function(a, b){
              if(a.startTime < b.startTime) { return -1; }
              if(a.startTime > b.startTime) { return 1; }
              return 0;
          });           
          
          //download the log files 
           this.downloadlog(result);          
          //generate the init step 
          if(y.length !== 0 ) {y = y.filter((i,idx) => y[idx-1] !== i)};
          if(x.length === 0 )
          { this.generateinitstep(result); }         
          //generate steps after initalization          
           this.generatenextstep(result);        
           console.log(x);
           console.log(result);
          //download the log file
          this.downloadstepbreakdown();     
          //open custom url
          
      }

      JSON2CSV(objArray) {
          var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = 'StepNo,Stepduration,LogStepStartID,LogMaxStepID,StepDetail\r\n';
      
        for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
            if (line != '') line += ','
      
            line += array[i][index];
          }
      
          str += line + '\r\n';
        }
      
        return str;
      }   

      downloadlog(result)
      {
        var exportName = 'RaptrMeasures_' +  Date.now().toString() + '.json';
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));            
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();            
      }
        
      downloadstepbreakdown()
       {
       
           // Convert Object to JSON
            var jsonObject = JSON.stringify(x);
            var csv = this.JSON2CSV(jsonObject);
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download =  'StepWiseBreakdown_' +  Date.now().toString() + '.csv';;
            document.body.appendChild(downloadLink);            
            downloadLink.click();
            document.body.removeChild(downloadLink);
       
       }
      generateinitstep(result)
      { 
        var maxEndTime = 0;
        var endTime = 0;
        var maxstepid = 0;
        
        if(y.length === 0)
        {
          y.push(result.length);
        }

        for (var i = 0 ; i< y[0] ; i++)
        {
          endTime = result[i].startTime + result[i].duration;
          if (endTime > maxEndTime){      
            maxEndTime = endTime;
            maxstepid = i;}
        }
        //  stepDuration = stepEndTime - stepStartTime , Since our start of step is the beginning of the webpage it will be 0 
        var stepDuration = maxEndTime - 0;      
        x.push({StepNo:1 , StepDuration:stepDuration.toFixed(2) , LogStepStartID:0 , LogMaxStepID : maxstepid , StepDetail : 'Initialization'});  
      }

      generatenextstep(result)
      {
        let stepStartTime = 0;
        let stepEndTime = 0;
        let maxEndTime = x[0].StepDuration;
        let endTime = 0;
        let stepNo = 1;
        var maxstepid = 0;
        let prev_stepid = 1;
        let stepDuration = 0;
        let logstepid = 0;
        let set_maxendtimezero = false ;

        for (let i = y[0]  ; i< result.length ; i++)
  {
    if (result[i].startTime > maxEndTime + 1000 && maxEndTime!= 0 ) {
        // This is a new step!!!       
     console.log(i) ;     

      if (result[i].source === 'external' )
      {
        maxEndTime = 0;      
        set_maxendtimezero = true;
      }
      else
      {              
       stepStartTime = result[i].startTime;
        maxEndTime = 0;
        stepNo++;
        logstepid = i;
      }
      
    }
    
   if (stepNo > 1 && prev_stepid != stepNo)
          {
           stepEndTime = maxEndTime;
           stepDuration = stepEndTime - stepStartTime;     
           x.push({StepNo:stepNo , StepDuration:stepDuration.toFixed(2) , LogStepStartID: logstepid , LogMaxStepID : maxstepid , StepDetail : result[i].name });  
             prev_stepid =  prev_stepid + 1;           
        }
    
    if(result[i].startTime>0)  
  { 
    endTime = result[i].startTime + result[i].duration;
    if (set_maxendtimezero === true) {
      endTime = 1 ;
      maxEndTime = 1;
      set_maxendtimezero = false ;
    }
    if (endTime > maxEndTime){      
      maxEndTime = endTime;
      maxstepid = i;
      if(stepNo != 1)
         { 
           x[stepNo-1].StepDuration = (maxEndTime - stepStartTime).toFixed(2);
           x[stepNo-1].LogMaxStepID = maxstepid;
         };
      
  }}
}     }
  }

  customElements.define('pka-button', PerformanceHelp);
})();
