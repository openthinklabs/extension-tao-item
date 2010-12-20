<?php

error_reporting(E_ALL);

/**
 * This container initialize the qti GraphicassociateInteraction form:
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
 * This container initialize the GraphicassociateInteraction form.
 *
 * @access public
 * @author CRP Henri Tudor - TAO Team - {@link http://www.tao.lu}
 * @package tao
 * @subpackage actions_form
 */
class taoItems_actions_QTIform_interaction_GraphicassociateInteraction
    extends taoItems_actions_QTIform_interaction_GraphicInteraction
{

    /**
     * Short description of method initElements
     *
     * @access public
     * @author CRP Henri Tudor - TAO Team - {@link http://www.tao.lu}
     * @return mixed
     */
    public function initElements()
    {
		$this->setCommonElements();
		$this->form->addElement(taoItems_actions_QTIform_AssessmentItem::createTextboxElement($this->getInteraction(), 'maxAssociations', __('Maximum number of associations')));
    }
	
	public function setCommonElements(){
		parent::setCommonElements();
	}
}

?>