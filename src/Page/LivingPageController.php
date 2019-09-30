<?php

namespace Symbiote\Frontend\LivingPage\Page;

use PageController;
use Symbiote\Frontend\LivingPage\Extension\LivingPageControllerExtension;

class LivingPageController extends PageController
{
    private static $extensions = [
        LivingPageControllerExtension::class
    ];
}