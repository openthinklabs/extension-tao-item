<?php

error_reporting(E_ALL);

/**
 * This container initialize the qti item form:
 *
 * @author CRP Henri Tudor - TAO Team - {@link http://www.tao.lu}
 * @package tao
 * @subpackage actions_form
 */

if (0 > version_compare(PHP_VERSION, '5')) {
    die('This file was generated for PHP 5');
}

/**
 * This class provide a container for a specific form instance.
 * It's subclasses instanciate a form and it's elements to be used as a
 *
 * @author CRP Henri Tudor - TAO Team - {@link http://www.tao.lu}
 */
require_once('tao/helpers/form/class.FormContainer.php');

/**
 * This container initialize the login form.
 *
 * @access public
 * @author CRP Henri Tudor - TAO Team - {@link http://www.tao.lu}
 * @package tao
 * @subpackage actions_form
 */
abstract class taoItems_actions_QTIform_choice_Choice
    extends tao_helpers_form_FormContainer
{
	
	/**
     * the class resource to create the form from
     *
     * @access protected
     * @var Choice
     */
    protected $choice = null;
	
	protected $formName = 'ChoiceForm_';
	
	public function __construct(taoItems_models_classes_QTI_Choice $choice = null){
		
		if(!is_null($choice)){
			$this->choice = $choice;
			$this->formName = 'ChoiceForm_'.$this->choice->getSerial();
		}
		$returnValue = parent::__construct(array(), array());
		
	}
   
	public function getChoice(){
		return $this->choice;
	}
	
	/**
     * The method initForm for all types of choice form
     *
     * @access public
     * @author CRP Henri Tudor - TAO Team - {@link http://www.tao.lu}
     * @return mixed
     */
    public function initForm()
    {
		$this->form = tao_helpers_form_FormFactory::getForm($this->formName);
		$this->form->setActions(array(), 'bottom');
		//no save elt required, all shall be done with ajax request
		// $saveElt = tao_helpers_form_FormFactory::getElement('Save', 'Save');
		// $saveElt->setValue(__('Save'));
		// $this->form->setActions(array($saveElt), 'top');//put save button on top because the bottom would be the place for the choice editing
		
    }
	
	public function setCommonElements(){
		
		//add hidden id element, to know what the old id is:
		$oldIdElt = tao_helpers_form_FormFactory::getElement('choiceSerial', 'Hidden');
		$oldIdElt->setValue($this->choice->getSerial());
		$this->form->addElement($oldIdElt);
		
		//id element: need for checking unicity
		$labelElt = tao_helpers_form_FormFactory::getElement('choiceIdentifier', 'TextBox');
		$labelElt->setDescription(__('Identifier'));
		$labelElt->setValue($this->choice->getIdentifier());
		$this->form->addElement($labelElt);
		
		//the fixed attribute element
		$fixedElt = tao_helpers_form_FormFactory::getElement('fixed', 'CheckBox');
		$fixedElt->setDescription(__('Fixed'));
		$fixedElt->setOptions(array('true' => ''));//empty label because the description of the element is enough
		$fixed = $this->choice->getOption('fixed');
		if(!empty($fixed)){
			if($fixed === 'true' || $fixed === true){
				$fixedElt->setValue('true');
			}
		}
		$this->form->addElement($fixedElt);
		
	}

}

?>