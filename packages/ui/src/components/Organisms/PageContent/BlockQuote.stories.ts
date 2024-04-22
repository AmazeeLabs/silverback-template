import { Markup } from '@custom/schema';
import Avatar from '@stories/avatar.jpg?as=metadata';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '../../../helpers/image';
import { BlockQuote } from './BlockQuote';

export default {
  component: BlockQuote,
} satisfies Meta<typeof BlockQuote>;

export const Quote = {
  args: {
    role: 'test role',
    author: 'Author name',
    image: {
      source: image(Avatar),
      alt: 'Portrait',
    },
    quote:
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>' as Markup,
  },
} satisfies StoryObj<typeof BlockQuote>;
