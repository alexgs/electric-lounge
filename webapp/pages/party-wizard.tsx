/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import { signIn, useSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import * as React from 'react';

import {
  Accordion,
  Logo,
  Maybe,
  PartyWizard as Panels,
  Spinner,
} from 'components';
import { BasicLayout } from 'components/layouts';
import { space } from 'components/tokens';

const ID = {
  API: 'spotify-api-check',
  SALUTE: 'for-those-about-to-rock',
  SPIN: 'spinner-demo',
};

const Welcome = styled.div({
  alignItems: 'center',
  display: 'flex',
  marginBottom: space.medium,

  '& span': {
    marginLeft: space.small,
  },
});

interface Action {
  accordionId: string;
}

type State = Record<string, boolean>;

function getInitialState() {
  if (typeof window === 'undefined') {
    return {};
  }

  return {
    [ID.API]: JSON.parse(sessionStorage.getItem(ID.API) ?? 'false'),
    [ID.SALUTE]: JSON.parse(sessionStorage.getItem(ID.SALUTE) ?? 'false'),
    [ID.SPIN]: JSON.parse(sessionStorage.getItem(ID.SPIN) ?? 'false'),
  }
}

function reducer(state: State, action: Action) {
  const id = action.accordionId;
  const newValue = !state[id];
  sessionStorage.setItem(id, `${newValue}`);
  return {
    ...state,
    [id]: newValue,
  };
}

const PartyWizard: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, {}, getInitialState);
  const [session, loading] = useSession();

  function handleAccordionClick(id: string) {
    dispatch({ accordionId: id });
  }

  if (loading) {
    return <Spinner />;
  }

  if (session) {
    const firstName = session.user.name.split(' ')[0];
    return (
      <BasicLayout>
        <Head>
          <title>Party Wizard | The Electric Lounge</title>
        </Head>
        <Logo />
        <Welcome>
          <Image width="40" height="40" src="/party-wizard.gif" />
          <span>Hello, {firstName}. You&apos;re ready to rock! 🤘</span>
        </Welcome>
        <Accordion
          heading={'Spotify API'}
          isOpen={state[ID.API]}
          onClick={handleAccordionClick}
          uniqueId={ID.API}
        >
          <Panels.SpotifyApiCheck />
        </Accordion>
        <Accordion
          heading={'For those about to rock...'}
          isOpen={state[ID.SALUTE]}
          onClick={handleAccordionClick}
          uniqueId={ID.SALUTE}
        >
          We salute you!
        </Accordion>
        <Accordion
          heading={'Spinners'}
          isOpen={state[ID.SPIN]}
          onClick={handleAccordionClick}
          uniqueId={ID.SPIN}
        >
          <Maybe test={state[ID.SPIN]}>
            <Spinner />
          </Maybe>
        </Accordion>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <Head>
        <title>Party Wizard | The Electric Lounge</title>
      </Head>
      <Logo />
      <div>
        {'The Party Wizard awaits, but you need to '}
        <a role="button" onClick={() => signIn()}>
          sign in
        </a>
        {' before you can rock out.'}
      </div>
    </BasicLayout>
  );
};

export default PartyWizard;
