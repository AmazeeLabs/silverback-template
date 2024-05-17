import {
  BlockImageWithTextFragment,
  Image,
  ImagePosition,
} from '@custom/schema';
import clsx from 'clsx';
import React from 'react';

import { BlockMarkup } from './BlockMarkup';

export function BlockImageWithText(props: BlockImageWithTextFragment) {
  return (
    <div className="my-12 lg:my-16">
      <div
        className={clsx(
          'flex flex-col lg:flex-row gap-2 lg:gap-16 items-start lg:items-center',
          {
            'lg:flex-row-reverse': props.imagePosition === ImagePosition.Right,
          },
        )}
      >
        {!!props.image?.source && (
          <div className={'lg:w-1/2 self-start'}>
            <Image
              className="object-cover w-full"
              source={props.image.source}
              alt={props.image.alt || ''}
            />
          </div>
        )}

        <div className={'lg:w-1/2 nested-container'}>
          {props.textContent?.markup && <BlockMarkup {...props.textContent} />}
        </div>
      </div>
    </div>
  );
}
