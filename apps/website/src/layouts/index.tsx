import { graphql, useStaticQuery } from '@amazeelabs/gatsby-plugin-operations';
import { FrameQuery, OperationExecutorsProvider } from '@custom/schema';
import { Frame } from '@custom/ui/routes/Frame';
import React, { PropsWithChildren } from 'react';

import { drupalExecutor } from '../utils/drupal-executor';

export default function Layout({
  children,
}: PropsWithChildren<{
  locale: string;
}>) {
  const data = useStaticQuery(graphql(FrameQuery));
  return (
    <OperationExecutorsProvider
      executors={[{ executor: drupalExecutor(`/graphql`) }]}
    >
      <OperationExecutorsProvider
        executors={[{ executor: data, id: FrameQuery }]}
      >
        <Frame>{children}</Frame>
      </OperationExecutorsProvider>
    </OperationExecutorsProvider>
  );
}
