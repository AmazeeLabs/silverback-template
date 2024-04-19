import {
  ContentHubQuery,
  ContentHubResultItemFragment,
  OperationExecutor,
  OperationResult,
  OperationVariables,
  Url,
} from '@custom/schema';
import Landscape from '@stories/landscape.jpg?as=metadata';
import Portrait from '@stories/portrait.jpg?as=metadata';
import { Meta, StoryObj } from '@storybook/react';
import qs from 'query-string';
import React from 'react';

import { image } from '../../helpers/image';
import { ContentHub, ContentHubQueryArgs } from './ContentHub';

type ContentHubExecutor = (
  id: typeof ContentHubQuery,
  vars: OperationVariables<typeof ContentHubQuery>,
) => Promise<OperationResult<typeof ContentHubQuery>>;

const pageSize = 6;

export default {
  title: 'Components/Organisms/ContentHub',
  render: (args) => {
    return (
      <OperationExecutor executor={args.exec} id={ContentHubQuery}>
        <ContentHub pageSize={pageSize} />
      </OperationExecutor>
    );
  },
} satisfies Meta<{ exec: ContentHubExecutor }>;

type ContentHubStory = StoryObj<{ exec: ContentHubExecutor }>;

export const Empty = {
  args: {
    exec: async () => ({
      contentHub: { total: 0, items: [] },
    }),
  },
} satisfies ContentHubStory;

export const Loading = {
  args: {
    exec: () => new Promise<OperationResult<typeof ContentHubQuery>>(() => {}),
  },
} satisfies ContentHubStory;

export const Error = {
  args: {
    exec: () =>
      new Promise<OperationResult<typeof ContentHubQuery>>(() => {
        throw 'Error loading content hub.';
      }),
  },
} satisfies ContentHubStory;

export const WithResults = {
  args: {
    exec: async (_, vars) => {
      const items = [...Array(82).keys()].map(
        (i) =>
          ({
            path: `/item/${i + 1}` as Url,
            title: `${i % 3 === 2 ? 'Article' : 'Story'} #${i + 1}`,
            teaserImage:
              i % 3 === 1
                ? undefined
                : {
                    alt: `Image for item #${i + 1}`,
                    source: image(i % 2 === 0 ? Landscape : Portrait, {
                      width: 400,
                      height: 300,
                    }),
                  },
          }) satisfies ContentHubResultItemFragment,
      );
      const args = qs.parse(vars.args || '') as ContentHubQueryArgs;
      const filtered = items.filter(
        (item) => !args.title || item.title.includes(args.title),
      );
      const offset = args.page
        ? ((parseInt(args.page) || 1) - 1) * pageSize
        : 0;
      return {
        contentHub: {
          total: filtered.length,
          items: filtered.slice(offset, offset + pageSize),
        },
      };
    },
  },
} satisfies ContentHubStory;

export const Filtered = {
  ...WithResults,
  parameters: {
    location: new URL('local:/content-hub?keyword=Article'),
  },
} satisfies ContentHubStory;

export const Paged = {
  ...WithResults,
  parameters: {
    location: new URL('local:/content-hub?page=2'),
  },
} satisfies ContentHubStory;
