<?php

use SilverStripe\View\Parsers\ShortcodeParser;
use Symbiote\Frontend\LivingPage\Control\LivingdocShortcodes;

ShortcodeParser::get('default')->register('livingpage_childlist', array(LivingdocShortcodes::class, 'childlist_handler'));
ShortcodeParser::get('default')->register('livingpage_show_field', array(LivingdocShortcodes::class, 'show_field_shortcode'));

ShortcodeParser::get('default')->register('listing', array(LivingdocShortcodes::class, 'listing_content'));
ShortcodeParser::get('default')->register('workflow_tasks', array(LivingdocShortcodes::class, 'workflow_tasks'));
ShortcodeParser::get('default')->register('random_item', array(LivingdocShortcodes::class, 'random_item'));
ShortcodeParser::get('default')->register('userform', array(LivingdocShortcodes::class, 'userform'));