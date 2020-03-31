<?php
namespace Symbiote\Frontend\LivingPage\Page;

use Page;
use Symbiote\Frontend\LivingPage\Extension\LivingPageExtension;

/**
 * @author marcus
 */
class ComponentPage extends Page
{
    private static $extensions = [
        LivingPageExtension::class
    ];
}
