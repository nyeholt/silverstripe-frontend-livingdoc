<?php

namespace Symbiote\Frontend\LivingPage\Model;

use SilverStripe\Security\Permission;
use Symbiote\Frontend\LivingPage\Admin\LivingPageModelAdmin;

trait ComponentTrait 
{
    public function canView($member = null)
    {
        return Permission::check('CMS_ACCESS');
    }

    public function canEdit($member = null)
    {
        return Permission::check('CMS_ACCESS_' . LivingPageModelAdmin::class);
    }

    public function canCreate($member = null, $context = [])
    {
        return $this->canEdit($member);
    }

    public function canDelete($member = null)
    {
        return $this->canEdit($member);
    }
}