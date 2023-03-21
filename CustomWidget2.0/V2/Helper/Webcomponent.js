(function () {
  let tmpl = document.createElement('template');
  tmpl.innerHTML = 
  `<select id = "myList">
    <option value="1"> Auto Log Mode </option>  
    <option value="2"> Manual Mode </option>  
    <option value="3"> Download Logs </option>   
   </select>` ;   
  
  let tmpl_b = document.createElement('template');
  tmpl_b.innerHTML = 
 `<button type="button" id="newBTN" > Download Logs</button>` ;  

   class PerformanceHelp extends HTMLElement {
      constructor() {
          super();
          this.init();           
      }

      init() {            
          window.widgetmode = 1; 
	      
	   $(document).ready(function(){          
          $('html').click(async function(event){
	  if(event.target.tagName !== 'custom-dropdown')
	 {
		console.log('Onclick Intercepted');
	 }
	  })});
          let shadowRoot = this.attachShadow({mode: "open"});
          shadowRoot.appendChild(tmpl.content.cloneNode(true));
          shadowRoot.appendChild(tmpl_b.content.cloneNode(true));
	        let dropdown_ref = shadowRoot.getElementById('myList');
      	  let button_ref = shadowRoot.getElementById('newBTN');
          
          dropdown_ref.addEventListener("click", event => {
          var event = new Event("onClick");
          this.fireDDStateChange();           
          this.dispatchEvent(event);
          });         
	        
          button_ref.addEventListener("click", event => {
          var event = new Event("onClick");
          this.fireButtonClick();           
          this.dispatchEvent(event);
          });          
      }

      fireDDStateChange() 
       {
        var divs = document.getElementsByTagName('custom-dropdown');
        var dropdown_val = divs[0].shadowRoot.getElementById('myList');
        window.widgetmode = parseInt(dropdown_val.value);
        if(window.widgetmode === 2)
        {
        var button_text = divs[0].shadowRoot.getElementById('newBTN');
        button_text.textContent = 'Log new Step';
        }
        else
        {
          divs[0].shadowRoot.getElementById('newBTN').textContent = 'Download Logs';
        }
       }
      
       fireButtonClick()
       {
        console.log('Button Clicked');
       }      
  }

  customElements.define('custom-dropdown', PerformanceHelp);
})();
