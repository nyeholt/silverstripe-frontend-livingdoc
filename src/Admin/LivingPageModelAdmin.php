<?php

namespace Symbiote\Frontend\LivingPage\Admin;

use SilverStripe\Admin\ModelAdmin;
use Symbiote\Frontend\LivingPage\Model\CompoundComponent;
use Symbiote\Frontend\LivingPage\Model\LivingPageStructure;
use Symbiote\Frontend\LivingPage\Model\PageComponent;

/**
 *
 *
 * @author marcus
 */
class LivingPageModelAdmin extends ModelAdmin
{
    private static $url_segment = 'livingpage';
    private static $menu_title = 'Living page';

    private static $managed_models = [PageComponent::class, CompoundComponent::class, LivingPageStructure::class];
}
