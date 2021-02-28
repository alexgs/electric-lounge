/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Global } from '@emotion/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import Head from 'next/head';
import * as React from 'react';

import { color, font } from './tokens';

// Manually import FontAwesome CSS and tell FA to not auto-add it [ref][1]
// [1]: https://stackoverflow.com/a/60512800
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const globalStyles = {
  'html,body': {
    background: color.background,
    color: color.primaryMedium,
    fontFamily: font.body,
    fontSize: 16,
    fontWeight: 400,
    margin: 0,
    padding: 0,
  },

  a: {
    borderBottom: '1px dotted',
    color: color.royalBlue,
    textDecoration: 'none',

    ':active': {
      borderBottom: '1px solid',
      textDecoration: 'none',
    },

    ':hover': {
      borderBottom: '1px solid',
      textDecoration: 'none',
    },
  },

  'h1, h2, h3, h4, h5, h6': {
    fontFamily: font.head,
    marginBottom: '0.25rem',
    marginTop: '1rem',
  },

  h1: {
    fontSize: font.size.title,
  },

  h2: {
    fontSize: font.size.heading1,
  },

  h3: {
    fontSize: font.size.heading2,
  },

  h4: {
    fontSize: font.size.heading3,
  },

  'ol, ul': {
    marginTop: 0,
    marginBottom: 0,
  },

  p: {
    marginTop: 0,
  },

  'p:last-of-type': {
    marginBottom: 0,
  },
};

// noinspection HtmlRequiredTitleElement
export const GlobalStyles: React.FC = () => (
  <>
    <Head>
      <link
        rel="stylesheet"
        href="https://unpkg.com/normalize.css/normalize.css"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
      />
    </Head>

    <Global styles={globalStyles} />
  </>
);
