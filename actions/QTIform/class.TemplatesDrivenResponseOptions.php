<?php

error_reporting(E_ALL);

/**
 * TAO - taoItems/actions/QTIform/class.TemplatesDrivenResponseOptions.php
 *
 * $Id$
 *
 * This file is part of TAO.
 *
 * Automatically generated on 25.01.2012, 16:01:55 with ArgoUML PHP module 
 * (last revised $Date: 2010-01-12 20:14:42 +0100 (Tue, 12 Jan 2010) $)
 *
 * @author Joel Bout, <joel.bout@tudor.lu>
 * @package taoItems
 * @subpackage actions_QTIform
 */

if (0 > version_compare(PHP_VERSION, '5')) {
    die('This file was generated for PHP 5');
}

/**
 * This class provide a container for a specific form instance.
 * It's subclasses instanciate a form and it's elements to be used as a
 *
 * @author Joel Bout, <joel.bout@tudor.lu>
 */
require_once('tao/helpers/form/class.FormContainer.php');

/* user defined includes */
// section 127-0-1-1-53d7bbd:135145c7d03:-8000:000000000000367C-includes begin
// section 127-0-1-1-53d7bbd:135145c7d03:-8000:000000000000367C-includes end

/* user defined constants */
// section 127-0-1-1-53d7bbd:135145c7d03:-8000:000000000000367C-constants begin
// section 127-0-1-1-53d7bbd:135145c7d03:-8000:000000000000367C-constants end

/**
 * Short description of class
 *
 * @access public
 * @author Joel Bout, <joel.bout@tudor.lu>
 * @package taoItems
 * @subpackage actions_QTIform
 */
class taoItems_actions_QTIform_TemplatesDrivenResponseOptions
    extends tao_helpers_form_FormContainer
{
    // --- ASSOCIATIONS ---


    // --- ATTRIBUTES ---

    /**
     * Short description of attribute responseProcessing
     *
     * @access public
     * @var ResponseProcessing
     */
    public $responseProcessing = null;

    /**
     * Short description of attribute response
     *
     * @access public
     * @var Response
     */
    public $response = null;

    // --- OPERATIONS ---

    /**
     * Short description of method __construct
     *
     * @access public
     * @author Joel Bout, <joel.bout@tudor.lu>
     * @param  ResponseProcessing responseProcessing
     * @param  Response response
     * @return mixed
     */
    public function __construct( taoItems_models_classes_QTI_response_ResponseProcessing $responseProcessing,  taoItems_models_classes_QTI_Response $response)
    {
        // section 127-0-1-1-53d7bbd:135145c7d03:-8000:0000000000003684 begin
		$this->responseProcessing = $responseProcessing;
        $this->response = $response;
        parent::__construct();
        // section 127-0-1-1-53d7bbd:135145c7d03:-8000:0000000000003684 end
    }

    /**
     * Short description of method initForm
     *
     * @access public
     * @author Joel Bout, <joel.bout@tudor.lu>
     * @return mixed
     */
    public function initForm()
    {
        // section 127-0-1-1-53d7bbd:135145c7d03:-8000:0000000000003680 begin
        $this->form = tao_helpers_form_FormFactory::getForm('InteractionResponseProcessingForm');

		$this->form->setActions(array(), 'bottom');
        // section 127-0-1-1-53d7bbd:135145c7d03:-8000:0000000000003680 end
    }

    /**
     * Short description of method initElements
     *
     * @access public
     * @author Joel Bout, <joel.bout@tudor.lu>
     * @return mixed
     */
    public function initElements()
    {
        // section 127-0-1-1-53d7bbd:135145c7d03:-8000:0000000000003682 begin
        $serialElt = tao_helpers_form_FormFactory::getElement('responseSerial', 'Hidden');
		$serialElt->setValue($this->response->getSerial());
		$this->form->addElement($serialElt);
		
        $rpElt = tao_helpers_form_FormFactory::getElement('responseprocessingSerial', 'Hidden');
		$rpElt->setValue($this->responseProcessing->getSerial());
		$this->form->addElement($rpElt);
		
		$mapKey = tao_helpers_Uri::encode(QTI_RESPONSE_TEMPLATE_MAP_RESPONSE);
		$mapPointKey = tao_helpers_Uri::encode(QTI_RESPONSE_TEMPLATE_MAP_RESPONSE_POINT);
		
		$availableTemplates = array(
			tao_helpers_Uri::encode(QTI_RESPONSE_TEMPLATE_MATCH_CORRECT) => __('correct')
		);
		
		//get interaction type:
		$qtiService = taoItems_models_classes_QTI_Service::singleton();
		$interaction = $qtiService->getComposingData($this->response);
		if(!is_null($interaction)){
			switch(strtolower($interaction->getType())){
				case 'order':
				case 'graphicorder':{
					break;
				}
				case 'selectpoint';
				case 'positionobject':{
					$availableTemplates[$mapPointKey] = __('map point');
					break;
				}
				default:{
					$availableTemplates[$mapKey] = __('map');
				}
			}
		}
		
		$ResponseProcessingTplElt = tao_helpers_form_FormFactory::getElement('processingTemplate', 'Combobox');
		$ResponseProcessingTplElt->setDescription(__('Processing type'));
		$ResponseProcessingTplElt->setOptions($availableTemplates);
		$ResponseProcessingTplElt->setValue($this->responseProcessing->getTemplate($this->response));
		$this->form->addElement($ResponseProcessingTplElt);
        // section 127-0-1-1-53d7bbd:135145c7d03:-8000:0000000000003682 end
    }

} /* end of class taoItems_actions_QTIform_TemplatesDrivenResponseOptions */

?>