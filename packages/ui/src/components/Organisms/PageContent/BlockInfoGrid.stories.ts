import { CtaIconPosition, InfoGridIcon, Markup, Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { BlockInfoGrid } from './BlockInfoGrid';

export default {
  component: BlockInfoGrid,
} satisfies Meta<typeof BlockInfoGrid>;

export const BlockCtaDefault = {
  args: {
    gridItems: [
      {
        icon: InfoGridIcon.Email,
        textContent: {
          markup: `<h3>Email us:</h1>
          <p>Email us for general queries, including marketing and partnership opportunities.</p>` as Markup,
        },
        cta: {
          text: 'Learn more',
          url: 'https://example.com' as Url,
          openInNewTab: false,
          icon: 'ARROW',
          iconPosition: CtaIconPosition.After,
        },
      },
      {
        icon: InfoGridIcon.Phone,
        textContent: {
          markup: `<h3>Call us:</h1>
          <p>Call us to speak to a member of our team. We are always happy to help.</p>` as Markup,
        },
        cta: {
          text: 'Learn more',
          url: 'https://example.com' as Url,
          openInNewTab: false,
          icon: 'ARROW',
          iconPosition: CtaIconPosition.After,
        },
      },
      {
        icon: InfoGridIcon.LifeRing,
        textContent: {
          markup: `<h3>Support</h1>
          <p>Check out helpful resources, FAQs and developer tools.</p>` as Markup,
        },
        cta: {
          text: 'Support center',
          url: 'https://example.com' as Url,
          openInNewTab: false,
          icon: 'ARROW',
          iconPosition: CtaIconPosition.After,
        },
      },
    ],
  },
} satisfies StoryObj<typeof BlockInfoGrid>;
