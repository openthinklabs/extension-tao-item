// alert('qtiEdit loaded');

qtiEdit = new Object();

qtiEdit.itemEditor = null;
qtiEdit.itemSerial = '';
qtiEdit.interactions = [];
qtiEdit.itemDataContainer = '';
qtiEdit.interactionFormContent = '';
qtiEdit.responseProcessingFormContent = '';
qtiEdit.responseMappingOptionsFormContainer = '';
qtiEdit.responseGrid = 'qtiAuthoring_response_grid';
qtiEdit.responseMappingMode = false;

qtiEdit.getEltInFrame = function(selector){
	var foundElts = [];
	//for each iframe:
	$('iframe').each(function(){
	
		//get its document
		$(this).each( function(){
			var selectedDocument = this.contentWindow.document;
			$(selector, selectedDocument).each(function(){
				foundElts.push($(this));  
			});
		});
		
	});
	return foundElts;
}

qtiEdit.getUniqueEltInFrame = function(selector){
	var foundElts = qtiEdit.getEltInFrame(selector);
	if(foundElts.length != 1){
		throw 'incorrect number of found with the selector '+selector+' ('+foundElts.length+')';
	}
	return foundElts[0];
}

//bind the interaction listener and refresh the table of interactions at the same time
qtiEdit.bindInteractionLinkListener = function(){
	//destroy all listeners:
	
	//reset the interaction array:
	qtiEdit.interactionSerials = [];
	
	var links = qtiEdit.getEltInFrame('.qti_interaction_link');
	for(var i in links){
		
		var interactionSerial = links[i].attr('id');
		
		qtiEdit.interactions[interactionSerial] = interactionSerial;
		
		links[i].unbind('click').click(function(){
			qtiEdit.currentInteractionSerial = $(this).attr('id');
			
			qtiEdit.loadInteractionForm(qtiEdit.currentInteractionSerial);
			try{
				responseEdit.buildGrid(qtiEdit.responseGrid, qtiEdit.currentInteractionSerial);
			}catch(err){
				CL('building grid error:', err);
			}
		});
		
	}
}

qtiEdit.addInteraction = function(interactionType, itemData, itemSerial){
	
	if(!itemSerial){
		itemSerial = qtiEdit.itemSerial
	}

	$.ajax({
	   type: "POST",
	   url: "/taoItems/QtiAuthoring/addInteraction",
	   data: {
			'interactionType': interactionType,
			'itemData': itemData,
			'itemSerial': itemSerial
	   },
	   dataType: 'json',
	   success: function(r){
			// CD(r, 'res');
			
			//set the content:
			qtiEdit.itemEditor.wysiwyg('setContent', $("<div/>").html(r.itemData).html());
			
			//then add listener
			qtiEdit.bindInteractionLinkListener();
	   }
	});
}

qtiEdit.deleteInteractions = function(interactionSerials){

	var data = '';
	//prepare the data to be sent:
	for(var i in interactionSerials){
		data += 'interactionSerials['+ i +']=' + interactionSerials[i] + '&';
	}
	data += 'itemSerial=' + qtiEdit.itemSerial;
	
	$.ajax({
	   type: "POST",
	   url: "/taoItems/QtiAuthoring/deleteInteractions",
	   data: data,
	   dataType: 'json',
	   success: function(r){
			
			if(r.deleted){
				for(var i in interactionSerials){
					if(interactionEdit.interactionSerial == interactionSerials[i]){
						// destroy the interaction form:
						$(qtiEdit.interactionFormContent).empty();
					}
					delete qtiEdit.interactions[interactionSerials[i]];
				}
				
				//destroy the response form:
				responseEdit.destroyGrid(qtiEdit.responseGrid);
				
				//save item data, i.e. validate the changes operated on the item data:
				qtiEdit.saveItemData();
			}
			
	   }
	});
	
}

/*
qtiEdit.checkInteractionDeletion = function(){
	
	//TODO: improve with the use of regular expressions: 
	var itemData = $(qtiEdit.itemDataContainer).val();
	for(var interactionSerial in qtiEdit.interactions){
		if(itemData.indexOf(interactionSerial)<0){
			//not found:
			return false;
		}
	}
	
	return true;
}
*/

qtiEdit.getDeletedInteractions = function(one){
	var deletedInteractions = [];
	var itemData = $(qtiEdit.itemDataContainer).val();//TODO: improve with the use of regular expressions:
	for(var interactionSerial in qtiEdit.interactions){
		if(itemData.indexOf(interactionSerial)<0){
			//not found so considered as deleted:
			deletedInteractions.push(interactionSerial);
			if(one){
				return deletedInteractions;
			}
		}
	}
	
	return deletedInteractions;
}

qtiEdit.saveItemData = function(itemSerial){
	
	if(!itemSerial){
		var itemSerial = qtiEdit.itemSerial;
	}
	
	$.ajax({
	   type: "POST",
	   url: "/taoItems/QtiAuthoring/saveItemData",
	   data: {
			'itemData': qtiEdit.itemEditor.wysiwyg('getContent'),
			'itemSerial': itemSerial
	   },
	   dataType: 'json',
	   success: function(r){
			CL('item saved');
	   }
	});
}

qtiEdit.loadInteractionForm = function(interactionSerial){
	$.ajax({
	   type: "POST",
	   url: "/taoItems/QtiAuthoring/editInteraction",
	   data: {
			'interactionSerial': interactionSerial,
			'itemSerial': qtiEdit.itemSerial
	   },
	   dataType: 'html',
	   success: function(form){
			$(qtiEdit.interactionFormContent).html(form);
	   }
	});
}

qtiEdit.loadResponseProcessingForm = function(itemSerial){
	
	if(!itemSerial){
		var itemSerial = qtiEdit.itemSerial;
	}
	
	$.ajax({
	   type: "POST",
	   url: "/taoItems/QtiAuthoring/editResponseProcessing",
	   data: {
			'itemSerial': itemSerial
	   },
	   dataType: 'html',
	   success: function(form){
			$(qtiEdit.responseProcessingFormContent).html(form);
	   }
	});
}

qtiEdit.saveResponseProcessing = function($myForm){
	$.ajax({
	   type: "POST",
	   url: "/taoItems/QtiAuthoring/saveResponseProcessing",
	   data: $myForm.serialize(),
	   dataType: 'json',
	   success: function(r){
			if(r.saved){
				createInfoMessage(__('The response processing has been saved'));
			}
	   }
	});
}