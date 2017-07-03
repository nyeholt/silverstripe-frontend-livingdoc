<?php

class LivingPageControllerExtension extends Extension
{
    private static $allowed_actions = array(
        'LivingForm',
        'renderembed'
    );

    public function onBeforeInit()
    {

        // at the top so it can be overridden by user css
        Requirements::css('frontend-livingdoc/javascript/livingdocs/css/base.css');

        // same with any highlight css needed
        Requirements::css('frontend-livingdoc/javascript/highlight/googlecode.css');

        if ($this->owner->getRequest()->getVar('edit') && !$this->owner->data()->canEdit()) {
            // redirect to login
            return Security::permissionFailure($this->owner);
        }

        if ($this->owner->getRequest()->getVar('edit') === 'stop') {
            $this->endEditing();
            return $this->owner->redirect($this->owner->data()->Link());
        }

        if (!strlen($this->owner->data()->PageStructure)) {
            $this->owner->data()->PageStructure = json_encode([
                'data' => LivingPageExtension::config()->default_page
            ]);
        }

        if ($this->owner->getRequest()->getVar('edit') && $this->owner->data()->canEdit()) {
            // needs to be done this way to ensure Stage mode is set via the session
            // otherwise it'll default to live because we're on the frontend
            $_GET['stage'] = 'Stage';
            Versioned::choose_site_stage();

            // trigger edit mode, so redirect works
            if ($this->getEditMode()) {
                return $this->owner->redirect($this->owner->data()->Link());
            }
        }
    }

    public function onAfterInit()
    {
        if (!$this->owner->getRequest()->getVar('edit') && $this->owner->data()->canEdit() && $this->getEditMode()) {
            // $record = $this->editingRecord();
            // needed to swap back to this; there's potential stage vs non-stage init issues here, but the
            // failover record setting later fails due to an SS bug
            $record = $this->owner->data();

            $design = json_decode($record->PageStructure, true);

            // check if we're incorrectly nested; supports legacy structures
            if (!isset($design['data']) && isset($design['content'])) {
                $design = ['data' => $design];
            }

            // create a default page data
            if (!$design) {
                $design = [
                    'data' => LivingPageExtension::config()->default_page
                ];
            }

            // make sure there's a design version
            if (!isset($design['data']['design']['version'])) {
                $design['data']['design'] = [
                    'name' => 'bootstrap3',
                    "version" => "0.0.1",
                ];
            }

            $designName    = $design['data']['design']['name'];
            // explicit binding because I'm too lazy right now to add yet another extension
            if (class_exists('Multisites') && Multisites::inst()->getCurrentSite()->LivingPageTheme) {
                $siteThemeName = Multisites::inst()->getCurrentSite()->LivingPageTheme;
                if ($siteThemeName != $designName) {
                    // go through _all_ components and update the design name
                    $design['data']['content'] = $record->updateDesignName($designName, $siteThemeName, $design['data']['content']);
                }
                $designName = $siteThemeName;
                $design['data']['design']['name'] = $siteThemeName;
            }

            // converts all nodes to current content state where necessary (in particular, embed items)
            $newContent = [];
            foreach ($design['data']['content'] as $component) {
                $newContent[] = $this->convertEmbedNodes($component);
            }

            $design['data']['content'] = $newContent;

            $this->owner->data()->extend('updateLivingDesign', $design);

            $designOptions = LivingPageExtension::config()->living_designs;

            $designFile = $designOptions[$designName];
            if (!$designFile) {
                throw new Exception("Missing design for $designName");
            }

            $record->PageStructure = json_encode($design);

//            $this->owner->setFailover($record);
//            $this->owner->failover   = $record;
//            $this->owner->dataRecord = $record;

            Requirements::block(THIRDPARTY_DIR.'/jquery/jquery.js');

            Requirements::javascript(THIRDPARTY_DIR.'/jquery-form/jquery.form.js');

            // our living docs integration files
            // will bind $ if not already bound, so that livingdocs doesn't die
            Requirements::javascript('frontend-livingdoc/javascript/lf-editor-content-bridge.js');
            Requirements::javascript('frontend-livingdoc/javascript/lf-links-buttons.js');
            Requirements::javascript('frontend-livingdoc/javascript/lf-attr-editor.js');
            Requirements::javascript('frontend-livingdoc/javascript/lf-editing-history.js');
            Requirements::javascript('frontend-livingdoc/javascript/lf-text-actions.js');
            Requirements::javascript('frontend-livingdoc/javascript/lf-html-editing.js');
            
            Requirements::javascript('frontend-livingdoc/javascript/living-frontend.js');


            Requirements::javascript('frontend-livingdoc/javascript/livingdocs/editable.js');
            Requirements::javascript('frontend-livingdoc/javascript/livingdocs/livingdocs-engine.js');

            Requirements::javascript('frontend-livingdoc/javascript/showdown/showdown.min.js');
            Requirements::javascript('frontend-livingdoc/javascript/ace/ace.min.js');
            Requirements::javascript('frontend-livingdoc/javascript/ace/mode-markdown.js');
            Requirements::javascript('frontend-livingdoc/javascript/ace/mode-html.js');
            Requirements::javascript('frontend-livingdoc/javascript/highlight/highlight.min.js');

            Requirements::javascript($designFile);

            
            Requirements::css('frontend-livingdoc/css/living-frontend.css');
        }
    }

    /**
     * Converts any embeditem shortcode into its current state representation
     *
     * @param array $component
     */
    protected function convertEmbedNodes(&$component)
    {
        if (isset($component['identifier']) && strpos($component['identifier'], 'embeddeditem') && isset($component['content'])) {
            foreach ($component['content'] as $name => $props) {
                $shortCode = $this->owner->data()->shortcodeFor($props['source']);
                if ($shortCode) {
                    $props['content'] = ShortcodeParser::get_active()->parse($shortCode);
                }
                $component['content'][$name] = $props;
            }
        }
        if (isset($component['containers'])) {
            foreach ($component['containers'] as $name => $items) {
                $newItems = [];
                foreach ($component['containers'][$name] as $subComponent) {
                    $newItems[] = $this->convertEmbedNodes($subComponent);
                }
                $component['containers'][$name] = $newItems;
            }
        }

        return $component;
    }

    public function renderembed()
    {
        $editing = $this->editingRecord();
        if (!$editing || !$editing->canEdit()) {
            return $this->owner->httpError('403');
        }
        $item      = $this->owner->getRequest()->getVar('embed');
        $available = $this->owner->data()->availableShortcodes();

        if (isset($available[$item])) {
            $shortcodeStr = $available[$item];
            return ShortcodeParser::get_active()->parse($shortcodeStr);
        }
    }

    protected function editingRecord()
    {
        Versioned::reading_stage('Stage');
        $recordClass = $this->owner->data()->ClassName;
        return $recordClass::get()->byID($this->owner->data()->ID);
    }

    public function getEditMode()
    {
        if (!$this->owner->data()->canEdit()) {
            return $this->endEditing();
        }
        // one-off preview that does _not_ stop edit mode
        if ($this->owner->getRequest()->getVar('preview')) {
            return false;
        }
        if ($this->owner->getRequest()->getVar('edit')) {
            Session::set('EditMode', 1);
        }

        $edit = ((int) Session::get('EditMode')) > 0;
        return $edit;
    }

    public function endEditing()
    {
        Session::clear('EditMode');
        $_GET['stage'] = 'Live';
        Versioned::choose_site_stage();
    }

    public function LivingForm()
    {
        if (!$this->getEditMode()) {
            return;
        }

        $embeds = $this->owner->data()->availableShortcodes();

        $fields = FieldList::create([
                HiddenField::create('PageStructure', "JSON structure"),
                HiddenField::create('Content', "HTML structure"),
                HiddenField::create('Embeds', 'Content embeds', json_encode($embeds)),
                HiddenField::create('EmbedLink', 'Embed link', $this->owner->data()->Link('renderembed'))
        ]);

        $actions = FieldList::create([
                FormAction::create('save', 'Save')->setUseButtonTag(true),
        ]);

        if ($this->owner->data()->canPublish()) {
            $actions->push(FormAction::create('publish', 'Pub')->setUseButtonTag(true));
        }

        $actions->push(FormAction::create('preview', 'View')->setUseButtonTag(true));
        $actions->push(FormAction::create('live', 'Done')->setUseButtonTag(true));

        $form = Form::create($this->owner, 'LivingForm', $fields, $actions);
        $form->loadDataFrom($this->owner->data());
        return $form;
    }

    public function save($data, Form $form, $request)
    {
        if (!$this->owner->data()->canEdit()) {
            return $this->owner->httpError(403);
        }

        $record = $this->editingRecord();

        $dummyHtmlField = HtmlEditorField::create('Content', 'Content', isset($data['Content']) ? $data['Content'] : '');
        $form->Fields()->replaceField('Content', $dummyHtmlField);
        $form->saveInto($record);

        $this->owner->getResponse()->addHeader('Content-type', 'application/json');
        if ($record->write()) {
            $this->owner->getResponse()->addHeader('Content-type', 'application/json');
            return json_encode(['status' => 'success']);
        }
        return $this->owner->httpError(500);
    }

    public function publish($data, Form $form, $request)
    {
        $record = $this->editingRecord();

        if (!$record->canPublish()) {
            return $this->owner->httpError(403);
        }

        $success = $record->doPublish();
        $this->owner->getResponse()->addHeader('Content-type', 'application/json');
        return json_encode(['status' => $success ? 'success' : 'fail']);
    }
}