/**
 * @namespace QTIWidget
 */
var QTIWidget = QTIWidget || {};

//
// SLIDER
//

/**
 * a slider widget
 * @methodOf QTIWidget
 */
QTIWidget.slider = function(ctx){
	
	//add the containers
	$(ctx.qti_item_id).append("<input type='hidden' id='qti_slider_value' />")
					.append("<div class='qti_slider'></div>")
						.append("<div class='qti_slider_label'></div>");
	
	var containerWidth = parseInt($(ctx.qti_item_id).width());
	
	//get the options
	var min 		= parseInt(ctx.opts['lowerBound']);
	var max 		= parseInt(ctx.opts['upperBound']);
	var step 		= parseInt(ctx.opts['step']);
	var stepLabel 	= (ctx.opts['stepLabel'] === true);
	var reverse 	= (ctx.opts['reverse'] === true);
	var orientation = 'horizontal';
	if($.inArray(ctx.opts['orientation'], ['horizontal', 'vertical']) > -1){
		orientation = ctx.opts['orientation'];
	}
	
	//calculate and adapt the slider size
	var sliderSize = ((max - min) / step) * 20;
	
	if(orientation == 'horizontal'){
		if(sliderSize > containerWidth){
			sliderSize = containerWidth - 20;
		}
		$(ctx.qti_item_id).addClass('qti_slider_horizontal');
		$(ctx.qti_item_id+' .qti_slider').width(sliderSize+'px');
		$(ctx.qti_item_id+' .qti_slider_label').width((sliderSize + 40)+'px');
	}
	else{
		var maxHeight = 300;
		if(sliderSize > maxHeight){
			sliderSize = maxHeight;
		}
		$(ctx.qti_item_id).addClass('qti_slider_vertical');
		$(ctx.qti_item_id+' .qti_slider').height(sliderSize+'px');
		$(ctx.qti_item_id+' .qti_slider_label').height((sliderSize + 20)+'px');
	}
	
	//mark the bounds
	if(!stepLabel){
		var displayMin = min;
		var displayMax = max;
		if(reverse){
			displayMin = max;
			displayMax = min;
		}
		$(ctx.qti_item_id+' .qti_slider_label')
			.append("<span class='slider_min'>"+displayMin+"</span>")
				.append("<span class='slider_max'>"+displayMax+"</span>");
		
	}
	else{
		//add a label to the steps, 
		//if there not the place we calculate the better interval
		
		var stepSpacing = 20;
		var displayRatio = 1;
		if((max * 20) > sliderSize){
			do{
				stepSpacing = (sliderSize / (max / displayRatio));
				displayRatio++;
			}while(stepSpacing < 25);
			displayRatio--;
		}
		var i = 0;
		for(i = min; i <= max; i += (step * displayRatio)){
			var displayIndex = i;
			if(reverse){
				displayIndex = max - i;
			}
			var $iStep = $("<span>"+displayIndex+"</span>");
			if(orientation == 'horizontal'){
				$iStep.css({left: ((i / displayRatio)  * stepSpacing) + 'px'});
			}
			else{
				$iStep.css({top: ((i / displayRatio)  * stepSpacing) + 'px'});
			}
			$(ctx.qti_item_id+' .qti_slider_label').append($iStep);
		}
		
		//always add the last step
		if(i != max){	
			if(i < max){
				$(ctx.qti_item_id+' .qti_slider_label span:last').remove();
			}
			var displayMax = max;
			if(reverse){
				displayMax = min;
			}
			var $iStep = $("<span>"+displayMax+"</span>");
			if(orientation == 'horizontal'){
				$iStep.css({right:'0px'});
			}
			else{
				$iStep.css({bottom:'0px'});
			}
			$(ctx.qti_item_id+' .qti_slider_label').append($iStep);
		}
	}
	
	//the input that has always the slider value
	var $sliderVal = $("#qti_slider_value");
	
	//set the start value
	var val = min;
	if( (reverse && orientation == 'horizontal') || (!reverse && orientation == 'vertical') ){
		val = max;
	}
	//get the current value if defined
	if(ctx.opts["values"]){
		if(typeof(ctx.opts["values"]) == 'string' && ctx.opts["values"] != ''){
			val = ctx.opts["values"];
		}
	}
	
	//create the slider
	$(ctx.qti_item_id+' .qti_slider').slider({
		value:	val,
		min: 	min,
		max: 	max,
		step: 	step,
		orientation: orientation,
		slide: function( event, ui ) {
			var val = ui.value;
			if( (reverse && orientation == 'horizontal') || (!reverse && orientation == 'vertical') ){
				val = max - ui.value;
			}
			$sliderVal.val(  val );
		}
	});
	$sliderVal.val(  val );
};


//
// UPLOAD
//

/**
 * a file upload widget
 * @methodOf QTIWidget
 */
QTIWidget.upload = function(ctx){
	
	var uploaderElt = $(ctx.qti_item_id + '_uploader');
	if(uploaderElt.length > 0){
		
		var fileExt = '*';
		if(ctx.opts['ext']){
			if(ctx.opts['ext'] != ''){
				fileExt = '*.' + ctx.opts['ext'];
			}
		}
		
		new AsyncFileUpload(uploaderElt, {
			"scriptData": {'session_id' : ctx.opts['session_id']},
			"basePath"  : ctx.wwwPath,
			"rootUrl"	: '',
			"fileDesc"	: 'Allowed files type: ' + fileExt,
			"fileExt"	: fileExt,
			"target"	: ctx.qti_item_id + '_data',
			"folder"    : "/"
		});
	}
};