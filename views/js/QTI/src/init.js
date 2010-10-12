/**
 * Initialize the QTI environment
 * @param {Object} qti_initParam the parameters of ALL item's interaction
 * @return void
 */
function qti_init(qti_initParam){
	for (var a in qti_initParam){
		qti_init_interaction(qti_initParam[a]);
	}
}

/**
 * Initialize the widget and the result collection for an interaction
 * @param {Object} initObj the params of the interaction (parts of qti_initParam identified by the interaction id)
 * @return void
 */
function qti_init_interaction(initObj){
	
	//instantiate the widget class with the given interaction parameters
	var myQTIWidget = new QTIWidget(initObj);
	
	//instantiate the result class with the interaction id
	var myResultCollector = new QTIResultCollector(myQTIWidget);
	
	//get the interaction type to identify the method 
	var typeName = initObj["type"].replace('qti_', '').replace('_interaction', '');
	
	/** @todo remove it in prod ! */
	if(!myQTIWidget[typeName]){
		console.log("Error: Unknow widget " + typeName);
	}
	
	//call the widget initialization method
	myQTIWidget[typeName].apply();
	
	// validation process
	$("#qti_validate").bind("click",function(){
		// Get user's data
		var result = myResultCollector[typeName].apply();
		console.log (result);
	});
		
}