(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<select id = "myList"  >  
      <option value="1"> Auto Mode </option>  
      <option value="2"> Manual Mode </option>  
      <option value="3"> Download Log </option>   
      </select>` ;   
   
    class PerformanceHelp extends HTMLElement {
        constructor() {
            super();
            this.init();           
        }

        init() {            
              
            let shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.addEventListener("click", event => {
            var event = new Event("onClick");
            this.fireChanged();           
            this.dispatchEvent(event);
            });           
        }

        fireChanged() {
            console.log("OnClick Triggered");     
            
        }        
        
    }

    customElements.define('custom-dropdown', PerformanceHelp);
})();
