<?php


/**
 * @author marcus
 */
class LivingPage extends Page
{
    private static $extensions = [
        'LivingPageExtension'
    ];
}

class LivingPage_Controller extends Page_Controller
{
    private static $extensions = [
        'LivingPageControllerExtension'
    ];
}