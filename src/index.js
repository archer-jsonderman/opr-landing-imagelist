import React from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import { init } from "contentful-ui-extensions-sdk"
import update from 'immutability-helper';
import Headline from "./components/headline"
import Repeater from "./components/repeater"
import "./index.scss"

//load stateless components to make up the Accolades Area Manager.
//this version includes headline, icon repeater
//TODO: add preview option in dialog
const initialData = {
	isDraggingOver: false,
	items:
		[
	        {
	            "id": "item",
	            "content": {
	                "image": {}
	            }
	        }
	    ],
	headline:""	
}
class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  }

constructor(props){
	super(props)
	
	if(!this.props.sdk.field.getValue()){
		this.state = initialData
	}else{
		this.state=this.props.sdk.field.getValue()
	}
}
    

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()
	// Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    //this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange)
    
    //console.log(this.state,' load')

  }
  componentWillUnmount() {
    //this.detachExternalChangeHandler()
  }
  
   handleStateChange =(target,newState)=>{
	   const updatedState = update(
		   this.state,{
			   [target]:{$set:newState}
		   }
	   )	  
	   this.setState(updatedState,this.saveValues)
	   
   }
  saveValues=()=>{
	  //console.log(this.state,' saving')
	  this.props.sdk.field.setValue(this.state)
  }
   onExternalChange = value => {
    this.setState({ value })
  }
 
  render = () => {
      return ( 
	      <>
		    <Headline 
		    	title = 'Accolades Headline'
		    	onStateChange={this.handleStateChange}
		    	{...this.state}/>
		    <Repeater
		    	sdk={this.props.sdk}
		    	onStateChange={this.handleStateChange}
		    	initData = {initialData}
		    	{...this.state}
		    />
		    </>
  		)
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"))
})

if (module.hot) {
  module.hot.accept()
}
