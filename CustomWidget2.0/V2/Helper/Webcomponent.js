(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<select id = "myList">
      <option value="1"> Auto Mode </option>  
      <option value="2"> Manual Mode </option>  
      <option value="3"> Download Log </option>   
     </select>` ;   
    
    let tmpl_b = document.createElement('template');
    tmpl_b.innerHTML = 
   `<button type="button" id="newBTN" > Download Log</button>` ;  

     class PerformanceHelp extends HTMLElement {
        constructor() {
            super();
            this.init();           
        }

        init() {            
            window.widgetmode = 1;  
            let shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            shadowRoot.appendChild(tmpl_b.content.cloneNode(true));
            this.addEventListener("click", event => {
            var event = new Event("onClick");
            this.fireChanged();           
            this.dispatchEvent(event);
            });           
        }

        fireChanged() 
         {
          var divs = document.getElementsByTagName('custom-dropdown');
          var val = divs[0].shadowRoot.getElementById('myList');
          window.widgetmode = val.value 
          if(window.widgetmode === 2)
          {
              console.log('Docmode');
          }
         }        
        
    }

    customElements.define('custom-dropdown', PerformanceHelp);
})();
