import { Link, useLocation } from '@custom/schema';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React from 'react';
import { z } from 'zod';

import { useIntl } from '../../utils/intl';

export const paginationParamsSchema = z.object({
  page: z.coerce.number().default(1),
});

export function useCurrentPage(): number {
  const [location] = useLocation();
  return paginationParamsSchema.parse(
    Object.fromEntries(new URLSearchParams(location.search).entries()),
  ).page;
}

export function Pagination(props: { total: number; pageSize: number }) {
  const currentPage = useCurrentPage();
  const intl = useIntl();
  const totalPages = Math.ceil(props.total / props.pageSize);
  const [location] = useLocation();
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <Link
          href={location}
          search={{ page: Math.max(currentPage - 1, 1) }}
          className={clsx(
            'inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
            {
              'opacity-50': currentPage === 1,
            },
          )}
        >
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          {intl.formatMessage({ defaultMessage: 'Previous', id: 'JJNc3c' })}
        </Link>
      </div>
      <div className="hidden md:-mt-px md:flex">
        <span className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600">
          {intl.formatMessage(
            { defaultMessage: '{current} of {total}', id: 'stJYEY' },
            {
              current: currentPage,
              total: totalPages,
            },
          )}
        </span>
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Link
          href={location!}
          search={{
            page: Math.min(currentPage + 1, totalPages),
          }}
          className={clsx(
            'inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
            {
              'opacity-50': currentPage === totalPages,
            },
          )}
        >
          {intl.formatMessage({ defaultMessage: 'Next', id: '9+Ddtu' })}
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Link>
      </div>
    </nav>
  );
}
