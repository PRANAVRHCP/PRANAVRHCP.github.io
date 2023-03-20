(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<select id = "myList" onchange = "favTutorial()" >  
      <option> w3schools </option>  
      <option> Javatpoint </option>  
      <option> tutorialspoint </option>  
      <option> geeksforgeeks </option>  
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
