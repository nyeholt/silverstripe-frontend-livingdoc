<?php

/**
 * Render shortcode data straight back to the browser
 *
 * @author marcus
 */
class ShortcodeRenderer extends Controller
{
    private static $allowed_actions = array(
        'display',
    );

    public function index(SS_HTTPRequest $request) {
        return "Nup";
    }

    public function display(SS_HTTPRequest $request) {
        $contextPageId = (int) $request->param('ID');
        if (!$contextPageId) {
            return $this->httpError(404);
        }

        $page = Page::get()->byID($contextPageId);
        if (!$page) {
            return $this->httpError(404);
        }
        if (!$page->canEdit()) {
            return $this->httpError(403);
        }

        // okay if the user can edit the page, we'll temporarily allow it.
        $shortcode = $request->getVar('shortcode');
        if (!$shortcode) {
            return 'Empty shortcode';
        }

        return $this->renderShortcode($shortcode);
    }

    public function renderShortcode($shortcodeStr) {
        return '<div data-shortcode="' . Convert::raw2att($shortcodeStr) . '">' . ShortcodeParser::get_active()->parse($shortcodeStr) . '</div>';
    }
}