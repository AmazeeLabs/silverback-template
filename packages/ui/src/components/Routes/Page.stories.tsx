import {
  FrameQuery,
  Locale,
  OperationExecutor,
  Url,
  ViewPageQuery,
} from '@custom/schema';
import Landscape from '@stories/landscape.jpg?as=metadata';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { image } from '../../helpers/image';
import { ImageRight } from '../Organisms/PageContent/BlockImageWithText.stories';
import { AccordionItemText } from '../Organisms/PageContent/BlockAccordion.stories';
import { Mixed, Paragraph } from '../Organisms/PageContent/BlockMarkup.stories';
import { WithCaption } from '../Organisms/PageContent/BlockMedia.stories';
import { Default as FrameStory } from './Frame.stories';
import { Page } from './Page';

export default {
  component: Page,
} satisfies Meta<typeof Page>;

export const Default = {
  render: (args) => {
    return (
      <OperationExecutor executor={() => args} id={ViewPageQuery}>
        <OperationExecutor executor={FrameStory.args} id={FrameQuery}>
          <Page />
        </OperationExecutor>
      </OperationExecutor>
    );
  },
  args: {
    page: {
      title: 'Page Title',
      locale: 'en',
      translations: [
        {
          locale: Locale.En,
          path: '/test' as Url,
        },
      ],
      path: '/test' as Url,
      content: [
        {
          __typename: 'BlockMarkup',
          ...Mixed.args,
        },
        {
          __typename: 'BlockMedia',
          ...WithCaption.args,
        },
        {
          __typename: 'BlockMarkup',
          ...Paragraph.args,
        },
        {
          __typename: 'BlockImageWithText',
          ...ImageRight.args,
        },
        {
          __typename: 'BlockAccordion',
          ...AccordionItemText.args,
        },
      ] as Exclude<ViewPageQuery['page'], undefined>['content'],
    },
  },
  parameters: {
    location: new URL('local:/gatsby-turbo'),
  },
} satisfies StoryObj<ViewPageQuery>;

export const Hero = {
  ...Default,
  args: {
    ...Default.args,
    page: {
      ...Default.args.page,
      hero: {
        headline: 'Page Hero Headline',
        lead: 'A longer lead text that even might break into multiple lines.',
        ctaUrl: '/test' as Url,
        ctaText: 'Call to action',
      },
    },
  },
} satisfies StoryObj<ViewPageQuery>;

export const FullHero = {
  ...Default,
  args: {
    ...Default.args,
    page: {
      ...Default.args.page,
      hero: {
        headline: 'Page Hero Headline',
        lead: 'A longer lead text that even might break into multiple lines.',
        image: {
          source: image(Landscape, { width: 2000 }),
          alt: 'Stock photo landscape hero.',
        },
        ctaUrl: '/test' as Url,
        ctaText: 'Call to action',
      },
    },
  },
} satisfies StoryObj<ViewPageQuery>;

export const FormHero = {
  ...Default,
  args: {
    ...Default.args,
    page: {
      ...Default.args.page,
      hero: {
        headline: 'Page Hero Headline',
        lead: 'A longer lead text that even might break into multiple lines.',
        image: {
          source: image(Landscape, { width: 2000 }),
          alt: 'Stock photo landscape hero.',
        },
        ctaUrl: '/test' as Url,
        ctaText: 'Call to action',
        formUrl: 'webforms/error/index.html' as Url,
      },
    },
  },
} satisfies StoryObj<ViewPageQuery>;
