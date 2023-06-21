import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl } from 'wordpress__components';

declare const Drupal: { t: (s: string) => string };

declare const drupalSettings: {
  path: {
    baseUrl: string;
    pathPrefix: string;
  };
  customGutenbergBlocks: {
    forms: Array<{
      id: string;
      url: string;
      label: string;
    }>;
  };
};

const { t: __ } = Drupal;

registerBlockType(`custom/form`, {
  title: __('Form'),
  icon: 'media-document',
  category: 'layout',
  attributes: {
    formId: {
      type: 'string',
    },
  },
  supports: {
    anchor: true,
  },
  edit: (props) => (
    <>
      <InspectorControls>
        <PanelBody>
          <SelectControl
            value={props.attributes.formId as string}
            options={[
              { label: __('- Select a form -'), value: '' },
              ...drupalSettings.customGutenbergBlocks.forms.map((form) => ({
                label: form.label,
                value: form.id,
              })),
            ]}
            onChange={(formId: string) => {
              props.setAttributes({
                formId,
              });
            }}
          />
        </PanelBody>
      </InspectorControls>
      <div className={'container-wrapper'}>
        <div className={'container-label'}>{__('Form')}</div>
        {props.attributes.formId ? (
          <iframe
            src={
              drupalSettings.customGutenbergBlocks.forms.find(
                (form) => form.id === props.attributes.formId,
              )!.url + '?iframe=true'
            }
            style={{ width: '100%', height: 300, pointerEvents: 'none' }}
          />
        ) : (
          <p>{__('Please select a form in the sidebar')}</p>
        )}
      </div>
    </>
  ),
  save: () => <InnerBlocks.Content />,
});
