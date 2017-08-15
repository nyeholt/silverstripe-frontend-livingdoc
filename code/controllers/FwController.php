<?php

/**
 * 
 *
 * @author marcus
 */
class FwController extends FrontEndWorkflowController
{
    private static $allowed_actions = [
        'index',
        'Form',
    ];

    public function index() {
        return $this->renderWith(array('Page', 'Page'));
    }

    //put your code here
    public function getContextType()
    {
        return 'SiteTree';
    }

    public function getWorkflowDefinition()
    {
        return WorkflowDefinition::get()->first();
    }

    public function Link()
    {
        return 'lf-workflow';
    }
}