<?php

namespace Symbiote\Frontend\LivingPage\Admin;

use SilverStripe\Admin\ModelAdmin;
use Symbiote\Frontend\LivingPage\Model\CompoundComponent;
use Symbiote\Frontend\LivingPage\Model\ComponentPageStructure;
use Symbiote\Frontend\LivingPage\Model\PageComponent;

/**
 * @author marcus
 */
class LivingPageModelAdmin extends ModelAdmin
{
    private static $url_segment = 'componentpage';
    private static $menu_title = 'Component pages';

    private static $managed_models = [
        ComponentPageStructure::class, 
        CompoundComponent::class, 
        PageComponent::class,
    ];
}
