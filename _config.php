<?php

ShortcodeParser::get('default')->register('livingpage_childlist', array('LivingdocShortcodes', 'childlist_handler'));
ShortcodeParser::get('default')->register('livingpage_show_field', array('LivingdocShortcodes', 'show_field_shortcode'));

ShortcodeParser::get('default')->register('listing', array('LivingdocShortcodes', 'listing_content'));
ShortcodeParser::get('default')->register('workflow_tasks', array('LivingdocShortcodes', 'workflow_tasks'));
ShortcodeParser::get('default')->register('random_item', array('LivingdocShortcodes', 'random_item'));
ShortcodeParser::get('default')->register('userform', array('LivingdocShortcodes', 'userform'));