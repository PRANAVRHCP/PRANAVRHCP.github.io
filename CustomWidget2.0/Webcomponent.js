(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = 
  `<button type="button" id="newBTN"> Perf Helper </button>` ;   
 
  class PerformanceHelper extends HTMLElement {
      constructor() {
          super();
          // declare global variables to be used across the whole scope of this code
          window.steplog = [];      
          window.xhr_log = [];
          window.xhr_np = [];
          window.sNo = 1;
          window.psNo = 0;        
          //window.x = [];         
          this.init();           
      }

      init() {            
          
         $(document).ready(function(){          
          $('html').click(async function(event){
            //add the details about the event click trigger text              
            //logic for step derivation -> For initial step only , will run only once
            if(sNo == 1)  {
                  let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering" && e.name !=="(Table) React-table-rendering"  && e.name !=="(Table) onQueryExecuted" && e.name !=="(Table) React-table-data-generation" );
                      lv_result = lv_result.sort(function(a, b){
                        if(a.startTime < b.startTime) { return -1; }
                        if(a.startTime > b.startTime) { return 1; }
                        return 0;
              });
                let reslen = lv_result.length ;
              if(psNo!==reslen)
              {
              //steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result  })
              steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen)  })
              psNo = reslen ;
              sNo = sNo + 1; } }

               // This is the usual flow for collecting steps - Check if entries are generated immediately when a click is made 

               setTimeout(function() 
               {              
                  // It will not be triggered when the user clicks the Performance Helper Button
                   if(event.target.tagName !== 'PKA-BUTTON02')
                   {              
                     let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering"  && e.name !=="(Table) React-table-rendering"   && e.name !=="(Table) onQueryExecuted" && e.name !=="(Table) React-table-data-generation"  );
                     lv_result = lv_result.sort(function(a, b){
                       if(a.startTime < b.startTime) { return -1; }
                       if(a.startTime > b.startTime) { return 1; }
                       return 0;
                   });
                   
                   let reslen = lv_result.length ;
                   if(psNo!==reslen)
                   {
                  // If new entries are present , compare the last entry of the previous step in step log
                  //Check if the start time + duration is more than one second , incase yes then it is a new step else the same step needs to be updated
                  //Previous step Start + End time 
                  var pstep_time =  steplog[steplog.length-1].StepSnapshot[steplog[steplog.length-1].StepSnapshot.length -1].startTime +  steplog[steplog.length-1].StepSnapshot[steplog[steplog.length-1].StepSnapshot.length -1].duration  
                  // This is the start step from the result snapshot  -> Start Time  lv_result[psNo].startTime
                 var diff_time = lv_result[psNo].startTime - pstep_time
                  if(diff_time > 1000) // This is a new step since the difference is more than 1 second
                  {
                    //steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result  })
                    steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen)  })
                    psNo = reslen ;
                    sNo = sNo + 1;       
                  }
                  else // This is the case when the step is the same but some entries were added which needs to be incorporated here

                  {
                    steplog[sNo-2].StepSnapshot = lv_result.slice(steplog[sNo-2].StepStartId,reslen);
                    //steplog[sNo-2].RaptrSnapshot = lv_result;
                    steplog[sNo-2].StepEndId = reslen-1 ;
                     psNo = reslen ;
                  }                           
                   } }
              }, 100); 
                
              // Collect steps , sometimes the entries are generated late and need to be collected once again , there is a delay added to capture this

              setTimeout(function() 
              {              
                 // It will not be triggered when the user clicks the Performance Helper Button
                  if(event.target.tagName !== 'PKA-BUTTON02')
                  {              
                    let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering"  && e.name !=="(Table) React-table-rendering"    && e.name !=="(Table) onQueryExecuted" && e.name !=="(Table) React-table-data-generation"  );
                    lv_result = lv_result.sort(function(a, b){
                      if(a.startTime < b.startTime) { return -1; }
                      if(a.startTime > b.startTime) { return 1; }
                      return 0;
                  });
                  
                  let reslen = lv_result.length ;
                  //If there are new entries -> the below logic will be entered
                  if(psNo!==reslen)
                  {
                  // If new entries are present , compare the last entry of the previous step in step log
                  //Check if the start time + duration is more than one second , incase yes then it is a new step else the same step needs to be updated
                  //Previous step Start + End time 
                  var pstep_time =  steplog[steplog.length-1].StepSnapshot[steplog[steplog.length-1].StepSnapshot.length -1].startTime +  steplog[steplog.length-1].StepSnapshot[steplog[steplog.length-1].StepSnapshot.length -1].duration  
                 
                  // This is the start step from the result snapshot  -> Start Time  lv_result[psNo].startTime
                 
                  var diff_time = lv_result[psNo].startTime - pstep_time

                  if(diff_time > 1000) // This is a new step since the difference is more than 1 second
                  {
                    //steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result  })
                    steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen)  })
                    psNo = reslen ;
                    sNo = sNo + 1;       
                  }
                  else // This is the case when the step is the same but some entries were added which needs to be incorporated here

                  {
                    steplog[sNo-2].StepSnapshot = lv_result.slice(steplog[sNo-2].StepStartId,reslen);
                   // steplog[sNo-2].RaptrSnapshot = lv_result;
                    steplog[sNo-2].StepEndId = reslen-1 ;
                     psNo = reslen ;
                  }                        
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
      //define a local this which can be used to call other methods later
      var local_this = this;
     
      window.sap.m.MessageBox.information('Performance Analysis Triggered.Info will be downloaded soon');
      //Create a timeout to capture all the events
      this.calladdstep(local_this);
   
    } // End of Fire Changed

    calladdstep(local_this)
    {
            setTimeout(function()       
      { 
      
      //Check incase there are any new entries (most likely not)
      let lv_result = window.sap.raptr.getEntries().filter(e => e.entryType === 'measure' && e.name !=="(Table) Rendering"  && e.name !=="(Table) React-table-rendering"   && e.name !=="(Table) onQueryExecuted" && e.name !=="(Table) React-table-data-generation" );
      lv_result = lv_result.sort(function(a, b){
             if(a.startTime < b.startTime) { return -1; }
             if(a.startTime > b.startTime) { return 1; }
             return 0;
         });
       let reslen = lv_result.length ;
         if(psNo!==reslen)
         {
         //steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) , RaptrSnapshot:lv_result})
         steplog.push({StepNo:sNo , StepStartId: psNo ,StepEndId: reslen-1 , StepSnapshot:lv_result.slice(psNo,reslen) })
         psNo = reslen ;
         sNo = sNo + 1; } 
      
      //Logic for widget derivation
      var local_log = [];
      var timeOrigin = performance.timeOrigin;

      for(var i = 0 ; i< steplog.length ; i++)
      {   
          //Create list of Ina Calls  
          steplog[i].InaCall = steplog[i].StepSnapshot.filter(e => e.source == "external");
          //Create list of Render widget based on identifiers
          let st = steplog[i].StepSnapshot.filter(e => e.identifier != null && e.identifier !== '');
          st = st.filter(e => e.identifier.includes("render")); 
          //Append list of Render widget based on identifiers 
          steplog[i].Widgetinfo = st;
          // Max Runtime derivation logic
          var stepstarttime = steplog[i].StepSnapshot[0].startTime ;
          var maxstepduration = 0;
          for(var y = 0 ; y < steplog[i].StepSnapshot.length ; y++)     
          {

            var stepduration = steplog[i].StepSnapshot[y].startTime + steplog[i].StepSnapshot[y].duration - stepstarttime ;
            if(stepduration > maxstepduration ) 
            {
              maxstepduration = stepduration ;
              var maxstepid = y + 1;
            }
          }
          steplog[i].StepDuration =  maxstepduration;
          steplog[i].StepSIDWithMaxDuration =  maxstepid;
          steplog[i].StepStartTime = local_this.processstarttime(stepstarttime,timeOrigin);
          steplog[i].StepEndTime = local_this.processendtime(stepstarttime,timeOrigin,maxstepduration);
          steplog[i].StepStartDate = local_this.setDate(timeOrigin);
         //create a local copy for download which is not soo detailed          
         local_log.push({StepNo : steplog[i].StepNo, StepStartDate : steplog[i].StepStartDate ,  StepStartTime : steplog[i].StepStartTime , StepDuration : parseInt(steplog[i].StepDuration) , InaCount : steplog[i].InaCall.length, WidgetCount : steplog[i].Widgetinfo.length }) ;
      }
         
         //Download the Network log
        // local_this.downloadlog(result_xhr , 'NetworkCalls');
         //Download the Step log
        // local_this.downloadlog(steplog , 'StepLog');
         //Download Local Log 
         //local_this.downloadstepbreakdown(local_this , local_log);

      }, 10000);
    }

    conver2hms_xhr(tstamp)
    {
      var hours = tstamp.getHours().toString().padStart(2, '0');
      var minutes = tstamp.getMinutes().toString().padStart(2, '0');
      var seconds = tstamp.getSeconds().toString().padStart(2, '0');
      var time = hours + minutes + seconds;
      time = parseInt(time);
      return time
    }

    processstarttime(startime ,timeOrigin )
    {
      var date = new Date(timeOrigin);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var time = (hours * 3600 + minutes * 60 + seconds) * 1000;   
      time = time + startime;
      var hours = Math.floor(time / (60*60*1000));
      var minutes = Math.floor((time % (60*60*1000)) / (60*1000));
      var seconds = Math.floor((time % (60*1000)) / 1000);
      var timeString = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
      return timeString;
    }
    
    processendtime(startime ,timeOrigin ,stepduration)
    {
      var date = new Date(timeOrigin);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var time = (hours * 3600 + minutes * 60 + seconds) * 1000;   
      time = time + startime + stepduration ;
      var hours = Math.floor(time / (60*60*1000));
      var minutes = Math.floor((time % (60*60*1000)) / (60*1000));
      var seconds = Math.floor((time % (60*1000)) / 1000);
      var timeString = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
      return timeString;
    }

    setDate(timeOrigin)
    {      
      var date = new Date(timeOrigin);
      var day = date.getUTCDate();
      var month = date.getUTCMonth() + 1; // getUTCMonth returns 0-based index
      var year = date.getUTCFullYear();
      var dateString = day.toString().padStart(2, '0') + "-" + month.toString().padStart(2, '0') + "-" + year.toString();
     return dateString;
    }
    
    downloadlog(result , fname)
      {
        var exportName = fname + '_' +  Date.now().toString() + '.json';
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));            
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();            
      }

      downloadstepbreakdown(local_this , local_log)
      {
          // Convert Object to JSON
           var jsonObject = JSON.stringify(local_log);
           var csv = local_this.JSON2CSV(jsonObject);
           var downloadLink = document.createElement("a");
           var blob = new Blob(["\ufeff", csv]);
           var url = URL.createObjectURL(blob);
           downloadLink.href = url;
           downloadLink.download =  'StepWiseBreakdown_' +  Date.now().toString() + '.csv';;
           document.body.appendChild(downloadLink);            
           downloadLink.click();
           document.body.removeChild(downloadLink);
      }

      JSON2CSV(objArray) {
       var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        // Set the column headers
       var str = 'StepNo,StepStartDate,StepStartTime,StepDuration,TotalBackendCalls,TotalWidgetAffected\r\n';    
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
    
  customElements.define('pka-button02', PerformanceHelper);
  
  function addXMLRequestCallback(callback){
  let oldSend;
  let i;
  if( XMLHttpRequest.callbacks ) {
      // we've already overridden send() so just add the callback
      XMLHttpRequest.callbacks.push( callback );
  } else {
      // create a callback queue
      XMLHttpRequest.callbacks = [callback];
      // store the native send()
      oldSend = XMLHttpRequest.prototype.send;
      // override the native send()
      XMLHttpRequest.prototype.send = function(){         
          for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
              XMLHttpRequest.callbacks[i]( this );
          }
          // call the native send()
          oldSend.apply(this, arguments);
      }
  }
}      
         
        addXMLRequestCallback( xhr => {
            if(xhr.requestUrl === 'https://bmw-dev.eu11.sapanalytics.cloud/sap/bc/ina/service/v2/GetResponse')
             { 
             // window.result_xhr.push(xhr);
          //processXhrResults(xhr);        
             }
           });     
           
        async function processXhrResults(xhr)
        {
          //Continue the execution of the callback to avoid any delay in processing
          setTimeout(function()
          {   
            var timestamp = new Date();   
            if(xhr.status == 200)          
            
            {   var response = JSON.parse(xhr._responseFormatted)  ;
              if(response !==null)
              {  
              if(response.grid !== undefined && response.grid !== null)
                {
                    var CellArraySize = grid[0].CellArraySizes[0] * grid[0].CellArraySizes[1];
                }
              }
                
                window.xhr_log.push({ CellArraySize : CellArraySize , NetworkInfo : 
                xhr._networkInfo , Step2CallMap : 0 , Timestamp :
                xhr._timestamp , Userfriendly : xhr._userFriendlyPerfData ,
                readstate : xhr.readyState
                 }) ; }
            else
            {
              trimresponsewithdelay(xhr);
            }
             /*var hours = timestamp.getHours().toString().padStart(2, '0');
              var minutes = timestamp.getMinutes().toString().padStart(2, '0');
              var seconds = timestamp.getSeconds().toString().padStart(2, '0');
              var ns = timestamp.getMilliseconds().toString().padStart(2,0) ;let hhmmss = hours + minutes + seconds + ns ;*/
              
            },2000)
            await 1;
        }

        async function trimresponsewithdelay(xhr)
        {
          setTimeout(function()
          {   
            //add another delay of 2 seconds             
            if(xhr.status == 200)          
            
            {   var response = JSON.parse(xhr._responseFormatted)  ;
              if(response !==null)
              {  
              if(response.grid !== undefined && response.grid !== null)
                {
                    var CellArraySize = grid[0].CellArraySizes[0] * grid[0].CellArraySizes[1];
                }
              }
                
                window.xhr_log.push({ CellArraySize : CellArraySize , NetworkInfo : 
                xhr._networkInfo , Step2CallMap : 0 , Timestamp :
                xhr._timestamp , Userfriendly : xhr._userFriendlyPerfData ,
                readstate : xhr.readyState
                 }) ; }
            else {
              var timestamp = new Date();  
              window.xhr_np.push( { xhr :  xhr , timestamp : timestamp , readstate : xhr.readyState , status:xhr.status });
            }
            },2000)
            await 1;
        }


})();
