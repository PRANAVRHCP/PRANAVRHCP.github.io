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
              console.log(window.sap.raptr.getEntries().filter(e => e.entryType === 'measure').length)
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
          //downloadlog(result);          
          //generate the init step 
          this.generateinitstep(result);
          console.log(x);
          console.log(result);

          //generate steps after initalization

          //download the log file

          //open custom url
          
      }

      JSON2CSV(objArray) {
          var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = 'StepNo,Stepduration,LogStepRefID,StepDetail\r\n';
      
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
  }

  customElements.define('pka-button', PerformanceHelp);
})();
