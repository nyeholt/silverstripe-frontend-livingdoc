<?php

namespace Symbiote\Frontend\LivingPage\Admin;

use SilverStripe\Admin\ModelAdmin;

/**
 * 
 *
 * @author marcus
 */
class LivingPageModelAdmin extends ModelAdmin
{
    private static $url_segment = 'livingpage';
    private static $menu_title = 'Living page';
    
    private static $managed_models = ['LivingPageStructure'];
}