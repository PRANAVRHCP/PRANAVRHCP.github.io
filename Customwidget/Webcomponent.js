(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<button type="button" id="myBtn"> Perf. Help </button>` ;   
   
    class PerformanceHelp extends HTMLElement {
        constructor() {
            super();
            window.y = 0;
            this.init();           
        }

        init() {            
            
           $(document).ready(function(){          
            $('html').click(function(event){
                if(window.y===0)
                {console.log(window.sap.raptr.getEntries().filter(e => e.entryType === 'measure').length)
                y = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure').length };
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
            
            //Retrieve the Log  
            console.log(y);
            let result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure');
            //Sort
            result = result.sort(function(a, b){
                if(a.startTime < b.startTime) { return -1; }
                if(a.startTime > b.startTime) { return 1; }
                return 0;
            });            
            
            var exportName = 'RaptrMeasures_' +  Date.now().toString() + '.json';
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));            
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", exportName);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            //downloadAnchorNode.click();
            //downloadAnchorNode.remove();            
            //Retreive the step wise approach
            
            let stepStartTime = 0;
            let stepEndTime = 0;
            let maxEndTime = 0;
            let endTime = 0;
            let stepNo = 1;
            let prev_stepid = 1;
            let stepDuration = 0;
            let x = [];
            
            for (let i = 0 ; i< result.length ; i++)
              {
                if (result[i].startTime > maxEndTime + 800 && maxEndTime!= 0 ) {
                    // This is a new step!!!       

                   if (stepNo == 1)
                   {
                     stepEndTime = maxEndTime;
                     stepDuration = stepEndTime - stepStartTime;           
                    x.push({StepNo:stepNo , stepduration:stepDuration.toFixed(2) , LogStepID:0 , stepdetail : 'Initialization'});  
                   }
                   stepStartTime = result[i].startTime;
                   maxEndTime = 0;
                   stepNo++;

                }
              if(result[i].startTime>0)  
              { endTime = result[i].startTime + result[i].duration;
                if (endTime > maxEndTime){      
                  maxEndTime = endTime;
                }
              }

               if (stepNo > 1 && prev_stepid != stepNo)
                      {
                       stepEndTime = maxEndTime;
                       stepDuration = stepEndTime - stepStartTime;           
                        x.push({StepNo:stepNo , stepduration:stepDuration.toFixed(2) , LogStepID:i });  
                         prev_stepid =  prev_stepid + 1;
                        // Store the information (start Time, max Endtime) of the previous step somewhere (e.g. a array used for CSV export)
                    }
            };
            if (x.length === 0) {
               stepEndTime = maxEndTime;
                stepDuration = stepEndTime - stepStartTime;           
                x.push({StepNo:stepNo , stepduration:stepDuration.toFixed(2) , LogStepID: 0 , stepdetail : 'Init'});  
            }
              // Convert Object to JSON
            var jsonObject = JSON.stringify(x);
            var csv = this.JSON2CSV(jsonObject);
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download =  'StepWiseBreakdown_' +  Date.now().toString() + '.csv';;
            document.body.appendChild(downloadLink);
            console.log(result);
            console.log(x);
            //downloadLink.click();
            //document.body.removeChild(downloadLink);
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
    }

    customElements.define('pka-button', PerformanceHelp);
})();
