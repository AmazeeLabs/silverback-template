import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl } from 'wordpress__components';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType('custom/image-with-text', {
  title: __('Image with Text'),
  icon: 'cover-image',
  category: 'layout',
  attributes: {
    mediaEntityIds: {
      type: 'array',
    },
    imagePosition: {
      type: 'string',
      default: 'left',
    },
  },
  edit: (props) => {
    const { setAttributes } = props;
    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Image position')}>
            <SelectControl
              value={props.attributes.imagePosition as string}
              options={[
                { label: __('Left'), value: 'left' },
                { label: __('Right'), value: 'right' },
              ]}
              onChange={(imagePosition: string) => {
                setAttributes({
                  imagePosition,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
        <div className={'container-wrapper'}>
          <div className={'container-label'}>{__('Image with Text')}</div>
          <DrupalMediaEntity
            classname={'w-full'}
            attributes={{
              ...(props.attributes as any),
              lockViewMode: true,
              viewMode: 'gutenberg_header',
              allowedTypes: ['image'],
            }}
            setAttributes={props.setAttributes}
            isMediaLibraryEnabled={true}
            onError={(error) => {
              // @ts-ignore
              error = typeof error === 'string' ? error : error[2];
              dispatch('core/notices').createWarningNotice(error);
            }}
          />
          <InnerBlocks
            templateLock={false}
            allowedBlocks={[
              // Only markup blocks.
              'core/paragraph',
              'core/list',
              'core/table',
              'core/quote',
              'custom/heading',
            ]}
            template={[['core/paragraph']]}
          />
        </div>
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
