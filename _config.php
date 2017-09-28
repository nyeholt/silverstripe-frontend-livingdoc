<?php

ShortcodeParser::get('default')->register('livingpage_childlist', array('LivingPageExtension', 'childlist_handler'));
ShortcodeParser::get('default')->register('livingpage_show_field', array('LivingPageExtension', 'show_field_shortcode'));