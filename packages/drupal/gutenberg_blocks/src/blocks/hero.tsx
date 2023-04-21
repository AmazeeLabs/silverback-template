import {
  // @ts-ignore
  __experimentalLinkControl as LinkControl,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody } from 'wordpress__components';
import { compose, withState } from 'wordpress__compose';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';

// @ts-ignore
const { t: __ } = Drupal;
// @ts-ignore
const { setPlainTextAttribute } = silverbackGutenbergUtils;

registerBlockType('custom/hero', {
  title: __('Hero'),
  icon: 'cover-image',
  category: 'layout',
  attributes: {
    mediaEntityIds: {
      type: 'array',
    },
    headline: {
      type: 'string',
    },
    lead: {
      type: 'string',
    },
    ctaUrl: {
      type: 'string',
    },
    ctaText: {
      type: 'string',
    },
    ctaOpenInNewTab: {
      type: 'boolean',
    },
    showLinkControl: {
      type: 'boolean',
      default: true,
    },
  },
  supports: {
    inserter: false,
    align: false,
    html: false,
  },
  // @ts-ignore
  edit: compose(withState())((props) => {
    return (
      <>
        <InspectorControls>
          <PanelBody title={__('CTA Link')}>
            {!!props.attributes.showLinkControl && (
              <LinkControl
                placeholder={__('Link')}
                value={{
                  url: props.attributes.ctaUrl,
                  openInNewTab: props.attributes.ctaOpenInNewTab,
                }}
                settings={{}}
                // @ts-ignore
                onChange={(link) => {
                  props.setAttributes({
                    ctaUrl: link.url,
                    ctaOpenInNewTab: link.opensInNewTab,
                  });
                }}
              />
            )}
            {!!props.attributes.ctaUrl && (
              <button
                type="button"
                style={{ marginTop: '24px' }}
                onClick={() => {
                  props.setAttributes({
                    ctaUrl: '',
                    ctaOpenInNewTab: undefined,
                    showLinkControl: false,
                  });
                  setTimeout(
                    () => props.setAttributes({ showLinkControl: true }),
                    0,
                  );
                }}
              >
                {__('Remove')}
              </button>
            )}
          </PanelBody>
        </InspectorControls>
        <div>
          <div>
            <DrupalMediaEntity
              attributes={{
                ...props.attributes,
                lockViewMode: true,
                viewMode: 'gutenberg_header',
                allowedTypes: ['image', 'video'],
              }}
              setAttributes={props.setAttributes}
              isMediaLibraryEnabled={true}
              onError={(error) => {
                // @ts-ignore
                error = typeof error === 'string' ? error : error[2];
                dispatch('core/notices').createWarningNotice(error);
              }}
            />
          </div>

          <div className={'prose lg:prose-xl mt-10'}>
            <div>
              <h1>
                <RichText
                  className={'mt-10'}
                  identifier="headline"
                  tagName="span"
                  value={props.attributes.headline}
                  allowedFormats={[]}
                  // @ts-ignore
                  disableLineBreaks={true}
                  placeholder={__('Headline')}
                  keepPlaceholderOnFocus={true}
                  onChange={(headline) => {
                    setPlainTextAttribute(props, 'headline', headline);
                  }}
                />
              </h1>
            </div>
            <div>
              <RichText
                identifier="lead"
                tagName="p"
                value={props.attributes.lead}
                allowedFormats={[]}
                // @ts-ignore
                disableLineBreaks={true}
                placeholder={__('Lead text')}
                keepPlaceholderOnFocus={true}
                onChange={(lead) => {
                  setPlainTextAttribute(props, 'lead', lead);
                }}
              />
            </div>
            {props.attributes.ctaUrl && (
              <div>
                <RichText
                  identifier="ctaText"
                  tagName="div"
                  multiline={false}
                  value={props.attributes.ctaText}
                  allowedFormats={[]}
                  // @ts-ignore
                  disableLineBreaks={true}
                  placeholder={__('CTA text')}
                  keepPlaceholderOnFocus={true}
                  style={{
                    cursor: 'text',
                  }}
                  onChange={(ctaText) => {
                    setPlainTextAttribute(props, 'ctaText', ctaText);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }),
  save: () => {
    return null;
  },
});
