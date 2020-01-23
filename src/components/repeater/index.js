import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import update from 'immutability-helper';
import arrayMove from 'array-move';
import {
	CardDragHandle,
	Button,
	Icon} from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import Uploader from "../imageUploader"
import './index.scss'; 

 	
const DragHandle = SortableHandle(() => {
	return(
		<div className="CardDragHandle__CardDragHandle___2rqnO">
			<svg data-test-id="cf-ui-icon" 
				className="Icon__Icon___38Epv Icon__Icon--small___1yGZK Icon__Icon--muted___3egnD" 
				xmlns="http://www.w3.org/2000/svg" 
				width="24" 
				height="24" 
				viewBox="0 0 24 24"
			>
				<path 
					fill="none" 
					d="M0 0h24v24H0V0z">
				</path>
				<path 
					d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z">
				</path>
			</svg>
		</div>
	)
});

const SortableItem = SortableElement((props) => {
	//console.log(props,' repeater')
	return (

		<div className="Item" >
			<DragHandle/>
			<div>
				<Uploader 
		  		sdk={props.sdk} 
		  		onImageChange={props.onItemChange}
		  		{...props} />
			</div>

			<div className="buttonArea">				
			    <button onClick={()=>props.onRemove(props)}
			    	className="removeButton">
			    	<Icon icon="Close"/>
				</button>
			</div>				
		</div>

	)
});

const SortableList = SortableContainer((props) => {
	//console.log(props)
	return (
		<div className="sortableList">

		  {props.items.map((item, index) => (
			    <SortableItem
			    	key={item.id} 	 
			    	index={index} 
			    	value={item}
			    	id={item.id}
			    	childIndex={index}
			    	child={item}
			    	{...props}
			    	/>
			    )   	
		  )}
		 
	</div>
	);
});



export default class Repeater extends React.Component {
	constructor(props) {
		super(props);
		this.handleItemChange = this.handleItemChange.bind(this)
			
	}
	
	componentDidMount(){
		//console.log(this.props,' repeater mount')
		 let initObj = this.props;
	  //if this is a new page, there is no field value, so set to a default structure to avoid object errors
	  if(!this.props.items)initObj=initFormat;
	  this.setState(initObj)
	}
	onSortEnd = ({oldIndex, newIndex}) => {
		const {items} = this.props;
		//console.log(items)	  
		//this.setState(({items}) => ({
	    const sorted = arrayMove(items, oldIndex, newIndex)
	    //console.log(sorted, 'osrt end')
	    this.props.onStateChange('items',sorted)
		//pass state to parent props
		//how to do the array move in immutability-helper
	};
  
  	handleAddItem=()=>{
		const {items} = this.props;//destructure, pull items object out
		const newId = 'item-'+[...Array(5)].map(_=>(Math.random()*36|0).toString(36)).join('');
		const newObj = {"id":newId	,"content":{"image":{}}}
		const AddState = [...items, newObj]//add new item to items object
		this.props.onStateChange('items',AddState);
		

  	}
  	handleItemChange=(value, props, element)=>{
	  	//value = items value, props = ALL passed props, element= type of element being changed
	  	//this allows us to update only the item and property that is changed, then pass to parent state
	  	/*console.log(props,' image props')
	  	console.log(value,' image value')
	  	console.log(element,' image element')*/
			const changed = update(props,{
				items:{
					[props.childIndex]:{
						content:{
							[element]:{
								$set:value
							}
						}
					}
				}
			})
			//console.log(changed,' updated')
			this.props.onStateChange('items',changed.items)
		
	}
  	handleRemove=(props)=>{
	  	/*update props object by splicing out the index item*/
	  	const {child} = props;
	  	
	  	const removal = update(props,{
	  		items:{$splice:[[props.childIndex,1]]}	
	  		} )
	  	this.props.onStateChange('items',removal.items)
	  	 	
  	} 	
	
	
	 modules = {
		toolbar: [
			['bold', 'italic', {'script':'super'}],
	      ['clean']
		    ],
	  }
	btnShow = () => {
		///set the limit from the index. 
		const btnState =  "block";
		return btnState;
	}
  	render() {
	    return (
		    <>
			    <SortableList 
			    	id="sortableList"
				    items={this.props.items} 
				    axis='xy'
				    distance={20}
				    onSortEnd={this.onSortEnd} 
				    onItemChange = {this.handleItemChange}
				    onRemove = {this.handleRemove}
				    modules = {this.modules}
				    {...this.props}
    		    /> 
				<Button
			      buttonType="muted" 
			      isFullWidth={true} 
			      icon="Plus" 
			      id="add-new-item"
			      onClick={this.handleAddItem}
			      style={{display: this.btnShow()}}
				  />
		    
		 
	      </>
		);
	  }
}
