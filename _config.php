<?php

ShortcodeParser::get('default')->register('livingpage_embeditem', array('LivingPage', 'embeditem_handler'));

ShortcodeParser::get('default')->register('livingpage_childlist', array('LivingPage', 'childlist_handler'));