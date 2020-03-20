<?php
namespace Symbiote\Frontend\LivingPage\Extension;

use SilverStripe\Core\Extension;

class LivingPageControllerExtension extends Extension
{
    private static $allowed_actions = array(
        'LivingForm',
        'pastefile',
        'renderembed'
    );

    public function onBeforeInit()
    {


    }

    public function onAfterInit()
    {

    }

    public function includeEditingRequirements() {

    }

}
