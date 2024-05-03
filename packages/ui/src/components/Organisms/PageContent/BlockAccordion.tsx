import { BlockAccordionFragment } from '@custom/schema';
import {
  ArrowRightCircleIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import { Accordion, CustomFlowbiteTheme, Flowbite } from 'flowbite-react';
import React from 'react';

import { BlockMarkup } from './BlockMarkup';

const accordionTheme: CustomFlowbiteTheme['accordion'] = {
  root: {
    base: 'divide-y divide-gray-200 border-gray-200 dark:divide-gray-700 dark:border-gray-700',
    flush: {
      off: 'border-b',
      on: 'border-b',
    },
  },
  content: {
    base: 'p-2 m-0 text-gray-200 dark:bg-gray-900',
  },
  title: {
    arrow: {
      base: 'h-0 w-0',
    },
    base: 'flex w-full items-center justify-between p-5 text-left font-medium text-gray-500 dark:text-gray-400',
    flush: {
      off: 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:focus:ring-gray-800',
      on: 'bg-transparent dark:bg-transparent',
    },
    heading: '',
    open: {
      off: '',
      on: 'text-gray-900 dark:text-gray-100',
    },
  },
};

// Applying the custom theme to the Accordion component
// doesn't work out, wrapping it in a Flowbite component.
const theme: CustomFlowbiteTheme = {
  accordion: accordionTheme,
};

export function BlockAccordion(props: BlockAccordionFragment) {
  return (
    <Flowbite theme={{ theme }}>
      <Accordion>
        {props.items.map((item, index) => (
          <Accordion.Panel key={index}>
            <Accordion.Title>
              <span className="flex items-center">
                {item.icon && <AccordionIcon icon={item.icon} />} {item.title}
              </span>
            </Accordion.Title>
            <Accordion.Content>
              {item.textContent?.markup && (
                <BlockMarkup {...item.textContent} />
              )}
            </Accordion.Content>
          </Accordion.Panel>
        ))}
      </Accordion>
    </Flowbite>
  );
}

function AccordionIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'questionmark':
      return (
        <QuestionMarkCircleIcon className="w-5 h-5 me-2 shrink-0 text-gray-500" />
      );
    case 'checkmark':
      return (
        <CheckCircleIcon className="w-5 h-5 me-2 shrink-0 text-gray-500" />
      );
    case 'arrow':
      return (
        <ArrowRightCircleIcon className="w-5 h-5 me-2 shrink-0 text-gray-500" />
      );
    default:
      return null;
  }
}