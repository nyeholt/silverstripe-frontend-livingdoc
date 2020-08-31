<?php

namespace Symbiote\Frontend\LivingPage\Page;

use PageController;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Requirements;

class ComponentPageController extends PageController
{
    public function doInit()
    {
        // if we're in 'stage' mode, and a living docs page, grab its
        parent::doInit();

        if (Versioned::get_stage() == Versioned::DRAFT) {
            Requirements::css('nyeholt/silverstripe-frontend-livingdoc: app/dist/main.css');
        }
    }

    public function isEditMode()
    {
        return $this->getRequest()->getVar('page-edit');
    }
}
