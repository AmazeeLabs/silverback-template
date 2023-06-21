import { SilverbackIframe } from '@amazeelabs/silverback-iframe';
import { BlockFormFragment, Url, useLocation } from '@custom/schema';
import React from 'react';

import { buildMessages, storeMessages } from '../../Molecules/Messages';

// TODO: Style, add stories.

export function BlockForm(props: BlockFormFragment) {
  const [, navigate] = useLocation();

  if (!props.url) {
    return null;
  }

  return (
    <SilverbackIframe
      src={props.url}
      buildMessages={buildMessages}
      redirect={(url, messages) => {
        if (messages) {
          storeMessages(messages);
        }
        navigate(url as Url);
      }}
      style={{
        width: '1px',
        minWidth: '100%',
      }}
      heightCalculationMethod="lowestElement"
    />
  );
}
