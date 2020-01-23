import React from "react";
import { init } from "contentful-ui-extensions-sdk";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import {FormLabel} from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.scss'; 

export default class Headline extends React.Component{
	constructor(props){
		super(props)
		//if(!this.props.value) console.log('no value - headline')
		this.handleEditorChange = this.handleEditorChange.bind(this)
	}
	handleEditorChange=(value)=>{
		this.props.onStateChange('headline',value)
	}
	 modules = {
		toolbar: [
			['bold', 'italic', {'script':'super'}],
			['clean']
		    ],
	  }
	render(){
		
		const {headline} = (typeof this.props!== 'undefined' && this.props)||'';
		//headline must be empty string and n ot undefined object or Quill has an issue
		return(
			<>
				<ReactQuill 
			  		name="accolades-headline"
			  		id="accolades-headline" 
			  		placeholder='Add your headline...'
			  		value={headline||''}
			  		onChange={(value)=>this.handleEditorChange(value)} 
			  		modules={this.modules}
			  		theme='bubble'
			  		bounds='self'
			  		/>
	  		</>
		)
	}
}