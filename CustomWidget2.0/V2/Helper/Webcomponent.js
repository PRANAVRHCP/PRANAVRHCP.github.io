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
		  var divs = document.getElementsByTagName('custom-dropdown');
		  var dropdown_val = divs[0].shadowRoot.getElementById('myList');
		  window.widgetmode = parseInt(dropdown_val.value);
		  if(window.widgetmode === 2)
		  {
      var divb = document.getElementsByTagName('custom-perfbutton');
		  divb[0].shadowRoot.getElementById('newBTN').textContent = 'Log new Step';		
		  }
		  else
		  {
      var divb = document.getElementsByTagName('custom-perfbutton');
			divb[0].shadowRoot.getElementById('newBTN').textContent = 'Download Logs';
		  }
		 } 
	}

  class ButtonHelp extends HTMLElement {
		constructor() {
			super();
			this.init_button();           
		}
  
		init_button() {            
			
			let shadowRoot = this.attachShadow({mode: "open"});			
			shadowRoot.appendChild(tmpl_b.content.cloneNode(true));
			this.addEventListener("click", event => {
			var event = new Event("onClick");
			this.firePerfHelp();           
			this.dispatchEvent(event);
			});           
		}
  
		firePerfHelp() 
		 {
      console.log('Button was clicked');
      console.log(window.widgetmode);
		 } 
    }
  
	customElements.define('custom-dropdown', PerformanceHelp);
	customElements.define('custom-perfbutton', ButtonHelp);
  })();
  
