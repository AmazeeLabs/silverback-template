import { FrameQuery, Link, Url } from '@custom/schema';
import clsx from 'clsx';
import React from 'react';
import { useIntl } from 'react-intl';

import { isTruthy } from '../../utils/isTruthy';
import { buildNavigationTree } from '../../utils/navigation';
import { useOperation } from '../../utils/operation';
import {
  DesktopMenuDropDown,
  DesktopMenuDropdownDisclosure,
} from '../Client/DesktopMenu';
import {
  MobileMenu,
  MobileMenuButton,
  MobileMenuDropdown,
  MobileMenuLink,
  MobileMenuProvider,
} from '../Client/MobileMenu';
import { LanguageSwitcher } from '../Molecules/LanguageSwitcher';

function useHeaderNavigation(lang: string = 'en') {
  return (
    useOperation(FrameQuery)
      .data?.mainNavigation?.filter((nav) => nav?.locale === lang)
      .pop()
      ?.items.filter(isTruthy) || []
  );
}

export function Header() {
  const intl = useIntl();
  const items = buildNavigationTree(useHeaderNavigation(intl.locale));

  return (
    <MobileMenuProvider>
      <header className="max-w-screen-xl mx-auto">
        <div className="hidden md:flex">
          <UserActions iconWidth="16" iconHeight="16" />
        </div>
        <nav
          className="border-b border-b-gray-200 z-20 relative mx-auto flex items-center justify-between py-6 px-3.5"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href={'/' as Url} className="-ml-1 mt-1 md:-mt-2.5">
              <span className="sr-only">
                {intl.formatMessage({
                  defaultMessage: 'Company name',
                  id: 'FPGwAt',
                })}
              </span>
              <SiteLogo width={213} height={59} className={'hidden lg:block'} />
              <SiteLogo width={160} height={40} className={'block lg:hidden'} />
            </Link>
          </div>
          <div className="flex md:hidden">
            <UserActions
              iconWidth="23"
              iconHeight="23"
              showIconText={false}
              isDesktop={false}
            />
            <MobileMenuButton className="inline-flex items-center justify-center rounded-md text-gray-700 ml-5 sm:ml-7 cursor-pointer"></MobileMenuButton>
          </div>
          <div className={'hidden md:flex'}>
            {items.map((item, key) =>
              item.children.length === 0 ? (
                <Link
                  key={key}
                  href={item.target}
                  className="text-base font-medium text-gray-600 ml-8 hover:text-blue-600"
                  activeClassName={'font-bold text-blue-200'}
                >
                  {item.title}
                </Link>
              ) : (
                <DesktopMenuDropDown title={item.title} key={item.title}>
                  {item.children.map((child) =>
                    child.children.length === 0 ? (
                      <Link
                        key={child.target}
                        href={child.target}
                        className="m-1.5 block hover:text-blue-600 p-2 text-sm leading-[1.25rem] text-gray-500"
                      >
                        {child.title}
                      </Link>
                    ) : (
                      <DesktopMenuDropdownDisclosure
                        title={child.title}
                        key={child.title}
                      >
                        {child.children.map((grandChild) => (
                          <Link
                            key={grandChild.target}
                            href={grandChild.target}
                            className="block p-2 pl-5 text-sm leading-[1.25rem] text-gray-500 hover:text-blue-600"
                          >
                            {grandChild.title}
                          </Link>
                        ))}
                      </DesktopMenuDropdownDisclosure>
                    ),
                  )}
                </DesktopMenuDropDown>
              ),
            )}
            </div>
            <LanguageSwitcher />
        </nav>
        <MobileMenu>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div>
                {items.map((item) =>
                  item.children.length === 0 ? (
                    <Link
                      key={item.title}
                      href={item.target}
                      className="block hover:text-blue-600 py-4 px-8 text-lg text-gray-600 border-b border-b-solid border-b-blue-100"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <MobileMenuDropdown
                      title={item.title}
                      key={item.title}
                      nestLevel={1}
                    >
                      {item.children.map((child) =>
                        child.children.length === 0 ? (
                          <Link
                            key={child.target}
                            href={child.target}
                            title={child.title}
                            className="block hover:text-blue-600 py-4 pr-8 pl-10 text-base text-gray-600"
                          >
                            {child.title}
                          </Link>
                        ) : (
                          <MobileMenuDropdown
                            title={child.title}
                            key={child.title}
                            nestLevel={2}
                          >
                            {child.children.map((grandChild) => (
                              <MobileMenuLink
                                key={grandChild.target}
                                href={grandChild.target}
                                title={grandChild.title}
                              />
                            ))}
                          </MobileMenuDropdown>
                        ),
                      )}
                    </MobileMenuDropdown>
                  ),
                )}
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </MobileMenu>
      </header>
    </MobileMenuProvider>
  );
}

function UserActions({
  iconWidth,
  iconHeight,
  showIconText = true,
  isDesktop = true,
}: {
  iconWidth: string;
  iconHeight: string;
  showIconText?: boolean;
  isDesktop?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex w-full justify-end md:py-3.5 md:px-3 0',
        isDesktop && 'border-b border-gray-300 border-opacity-30',
      )}
    >
      <a href="/login" className={'flex items-center text-gray-600'}>
        <UnlockIcon iconWidth={iconWidth} iconHeight={iconHeight} />
        {showIconText && (
          <span className={'block md:ml-2 text-[0.875rem] leading-[1.25]'}>
            Login
          </span>
        )}
      </a>
    </div>
  );
}

function UnlockIcon({
  iconWidth,
  iconHeight,
}: {
  iconWidth: string;
  iconHeight: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 13 16"
      fill="none"
    >
      <path
        d="M6.5 8.8C6.25263 8.79715 6.01032 8.86899 5.80567 9.00584C5.60102 9.14269 5.44387 9.33799 5.35536 9.56544C5.26685 9.7929 5.25124 10.0416 5.31062 10.278C5.37 10.5145 5.50153 10.7274 5.6875 10.888V12C5.6875 12.2122 5.7731 12.4157 5.92548 12.5657C6.07785 12.7157 6.28451 12.8 6.5 12.8C6.71549 12.8 6.92215 12.7157 7.07452 12.5657C7.2269 12.4157 7.3125 12.2122 7.3125 12V10.888C7.49847 10.7274 7.63 10.5145 7.68938 10.278C7.74876 10.0416 7.73315 9.7929 7.64464 9.56544C7.55613 9.33799 7.39898 9.14269 7.19433 9.00584C6.98968 8.86899 6.74737 8.79715 6.5 8.8ZM10.5625 5.6V4C10.5625 2.93913 10.1345 1.92172 9.37262 1.17157C8.61075 0.421427 7.57744 0 6.5 0C5.42256 0 4.38925 0.421427 3.62738 1.17157C2.86551 1.92172 2.4375 2.93913 2.4375 4V5.6C1.79103 5.6 1.17105 5.85286 0.713927 6.30294C0.256807 6.75303 0 7.36348 0 8V13.6C0 14.2365 0.256807 14.847 0.713927 15.2971C1.17105 15.7471 1.79103 16 2.4375 16H10.5625C11.209 16 11.829 15.7471 12.2861 15.2971C12.7432 14.847 13 14.2365 13 13.6V8C13 7.36348 12.7432 6.75303 12.2861 6.30294C11.829 5.85286 11.209 5.6 10.5625 5.6ZM4.0625 4C4.0625 3.36348 4.31931 2.75303 4.77643 2.30294C5.23355 1.85286 5.85353 1.6 6.5 1.6C7.14647 1.6 7.76645 1.85286 8.22357 2.30294C8.68069 2.75303 8.9375 3.36348 8.9375 4V5.6H4.0625V4ZM11.375 13.6C11.375 13.8122 11.2894 14.0157 11.137 14.1657C10.9847 14.3157 10.778 14.4 10.5625 14.4H2.4375C2.22201 14.4 2.01535 14.3157 1.86298 14.1657C1.7106 14.0157 1.625 13.8122 1.625 13.6V8C1.625 7.78783 1.7106 7.58434 1.86298 7.43431C2.01535 7.28429 2.22201 7.2 2.4375 7.2H10.5625C10.778 7.2 10.9847 7.28429 11.137 7.43431C11.2894 7.58434 11.375 7.78783 11.375 8V13.6Z"
        fill="#1A56DB"
      />
    </svg>
  );
}

function SiteLogo({
  className,
  width,
  height,
}: {
  className?: string;
  width: number;
  height: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 168 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask
        id="mask0_176_129733"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="168"
        height="14"
      >
        <path d="M167.999 0H0V14H167.999V0Z" fill="white"></path>
      </mask>
      <g mask="url(#mask0_176_129733)">
        <path
          d="M165.267 13.4665C166.124 13.1115 166.793 12.6068 167.276 11.9537C167.758 11.3007 168 10.5279 168 9.63681C168 8.99092 167.864 8.45054 167.591 8.01709C167.318 7.58365 166.934 7.22149 166.439 6.93063C165.943 6.63976 165.372 6.4045 164.725 6.22343C164.078 6.04235 163.385 5.89406 162.65 5.77715C162.167 5.70015 161.723 5.61175 161.317 5.5148C160.911 5.41784 160.558 5.29522 160.26 5.14694C159.962 4.99866 159.729 4.81758 159.565 4.60371C159.4 4.38984 159.318 4.14175 159.318 3.85659C159.318 3.50726 159.445 3.2107 159.699 2.96403C159.952 2.71879 160.295 2.53059 160.726 2.40226C161.157 2.27394 161.653 2.20835 162.212 2.20835C162.733 2.20835 163.227 2.27679 163.697 2.41224C164.166 2.5477 164.609 2.75159 165.02 3.02249C165.432 3.29339 165.798 3.62418 166.115 4.012L167.658 2.28677C167.303 1.80913 166.864 1.39849 166.345 1.05488C165.824 0.712681 165.225 0.450333 164.546 0.269255C163.867 0.0881779 163.108 -0.00164795 162.271 -0.00164795C161.484 -0.00164795 160.757 0.0924553 160.091 0.279236C159.424 0.467443 158.836 0.735494 158.329 1.08339C157.821 1.43271 157.427 1.85618 157.149 2.35379C156.87 2.85139 156.73 3.41031 156.73 4.03053C156.73 4.65076 156.841 5.14837 157.063 5.60177C157.285 6.05375 157.612 6.4487 158.044 6.78519C158.475 7.12168 159.001 7.39544 159.624 7.60931C160.246 7.82318 160.957 7.99428 161.757 8.1226C162.1 8.17393 162.443 8.23239 162.784 8.29655C163.127 8.36214 163.456 8.43913 163.774 8.52896C164.092 8.62021 164.374 8.73285 164.621 8.8683C164.869 9.00375 165.065 9.16629 165.212 9.35307C165.358 9.54128 165.431 9.76371 165.431 10.0218C165.431 10.4096 165.281 10.7361 164.983 11.0013C164.684 11.2665 164.304 11.4661 163.84 11.603C163.377 11.7384 162.885 11.8069 162.364 11.8069C161.463 11.8069 160.623 11.6301 159.841 11.2736C159.06 10.9186 158.283 10.3069 157.509 9.44147L156.043 11.4191C156.538 11.988 157.093 12.4599 157.709 12.8349C158.325 13.2099 159.01 13.4979 159.766 13.6975C160.52 13.8971 161.349 13.9984 162.251 13.9984C163.406 13.9984 164.413 13.8201 165.27 13.4651M143.663 2.49922H147.737C148.434 2.49922 149 2.63182 149.431 2.89702C149.862 3.16222 150.078 3.56002 150.078 4.08899C150.078 4.42548 149.986 4.71635 149.802 4.96159C149.619 5.20682 149.361 5.39788 149.031 5.53333C148.7 5.66879 148.332 5.73723 147.926 5.73723H143.661V2.50064L143.663 2.49922ZM143.663 7.90873H148.137C148.581 7.90873 149.007 7.97004 149.413 8.09266C149.819 8.21528 150.149 8.40634 150.403 8.66441C150.656 8.9239 150.784 9.2661 150.784 9.69242C150.784 10.0931 150.679 10.4324 150.47 10.7104C150.26 10.9885 149.966 11.1952 149.585 11.3307C149.204 11.4661 148.754 11.5346 148.233 11.5346H143.663V7.90873ZM148.233 13.803C148.892 13.803 149.524 13.7289 150.127 13.5806C150.731 13.4323 151.27 13.2028 151.746 12.8919C152.222 12.5811 152.596 12.1676 152.869 11.6515C153.142 11.1353 153.277 10.508 153.277 9.77083C153.277 9.11211 153.135 8.53894 152.849 8.05416C152.563 7.56939 152.18 7.17444 151.697 6.87074C151.214 6.56704 150.68 6.35032 150.098 6.22057L150.04 6.60839C150.865 6.38882 151.494 6.02096 151.925 5.50339C152.356 4.98725 152.572 4.3599 152.572 3.62275C152.572 2.88561 152.394 2.28535 152.038 1.78061C151.683 1.27588 151.156 0.892333 150.457 0.627133C149.759 0.361933 148.896 0.229333 147.867 0.229333H141.24V13.8059H148.228L148.233 13.803ZM135.12 10.8174L134.511 8.62591H127.39L126.514 10.8174H135.12ZM126.361 13.803L129.998 5.48486C130.099 5.22679 130.209 4.96159 130.322 4.68926C130.437 4.41835 130.55 4.13319 130.665 3.83662C130.78 3.53863 130.886 3.24491 130.988 2.95405C131.089 2.66319 131.184 2.3823 131.274 2.10997L130.703 2.12993C130.778 2.36234 130.868 2.62469 130.969 2.91555C131.07 3.20642 131.179 3.50441 131.292 3.80811C131.407 4.11181 131.518 4.40695 131.625 4.69068C131.733 4.97442 131.838 5.22108 131.939 5.42782L135.595 13.8044H138.203L132.281 0.232184H129.786L123.845 13.8059H126.358L126.361 13.803ZM121.176 13.803V11.4761H114.532V0.232184H112.057V13.8059H121.176V13.803ZM91.2451 5.7358H83.267V7.98572H91.2451V5.7358ZM92.2924 13.803V11.5146H84.4473V2.5206H92.2168V0.232184H82.0097V13.8059H92.2924V13.803ZM76.7689 5.7358H68.7909V7.98572H76.7689V5.7358ZM77.8162 13.803V11.5146H69.9712V2.5206H77.7406V0.232184H67.5335V13.8059H77.8162V13.803ZM63.8637 13.803V11.4561H54.1327L54.9896 12.1149L63.6523 1.97737V0.232184H52.3419V2.61756H61.3868L60.53 1.91891L51.8462 12.0407V13.8059H63.8623L63.8637 13.803ZM46.2302 10.8174L45.6211 8.62591H38.5L37.6235 10.8174H46.2302ZM37.4709 13.803L41.1085 5.48486C41.2107 5.22679 41.3185 4.96159 41.4319 4.68926C41.5453 4.41693 41.6601 4.13319 41.7749 3.83662C41.8897 3.53863 41.9976 3.24491 42.0984 2.95405C42.1992 2.66319 42.2944 2.3823 42.384 2.10997L41.8127 2.12993C41.8883 2.36234 41.9779 2.62469 42.0788 2.91555C42.1796 3.20642 42.2888 3.50441 42.4022 3.80811C42.517 4.11181 42.6276 4.40695 42.7354 4.69068C42.8432 4.97442 42.9483 5.22108 43.0491 5.42782L46.7049 13.8044H49.3133L43.3907 0.232184H40.8956L34.9548 13.8059H37.4681L37.4709 13.803ZM19.8556 13.803V8.59027C19.8556 7.43964 19.8303 6.3988 19.7799 5.46775C19.7295 4.5367 19.6273 3.60564 19.4747 2.67602L19.2087 3.56857L23.6906 13.8073H25.543L30.0977 3.56715L29.8316 2.67459C29.679 3.63131 29.5768 4.57804 29.5264 5.5148C29.476 6.45298 29.4508 7.47671 29.4508 8.58884V13.8044H31.9067V0.232184H29.2058L24.042 11.7313L25.2797 11.7513L20.1356 0.232184H17.3969V13.8059H19.8528L19.8556 13.803ZM11.2754 10.8174L10.6664 8.62591H3.54238L2.66589 10.8174H11.2726H11.2754ZM2.51607 13.803L6.15367 5.48486C6.25588 5.22679 6.36369 4.96159 6.4771 4.68926C6.59191 4.41835 6.70533 4.13319 6.82014 3.83662C6.93495 3.53863 7.04136 3.24491 7.14357 2.95405C7.24579 2.66319 7.3396 2.3823 7.4292 2.10997L6.85794 2.12993C6.93355 2.36234 7.02316 2.62469 7.12397 2.91555C7.22618 3.20642 7.33399 3.50441 7.44741 3.80811C7.56222 4.11181 7.67283 4.40695 7.78064 4.69068C7.88845 4.97442 7.99347 5.22108 8.09428 5.42782L11.7501 13.8044H14.3586L8.43591 0.232184H5.94084L0 13.8059H2.51327L2.51607 13.803Z"
          fill="#1D1D1B"
        ></path>
      </g>
      <mask
        id="mask1_176_129733"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="168"
        height="14"
      >
        <path d="M168 0H0V14H168V0Z" fill="white"></path>
      </mask>
      <g mask="url(#mask1_176_129733)">
        <path
          d="M108.051 11.5175H95.9463V13.8059H108.051V11.5175Z"
          fill="#1D1D1B"
        ></path>
      </g>
    </svg>
  );
}
