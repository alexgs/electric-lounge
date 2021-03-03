/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import styled from '@emotion/styled';
import { signIn, useSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image'
import * as React from 'react';

import { Accordion, Logo, PartyWizard as Panels } from 'components';
import { BasicLayout } from 'components/layouts';
import { space } from 'components/tokens';

const Welcome = styled.div({
  alignItems: 'center',
  display: 'flex',
  marginBottom: space.medium,

  '& span': {
    marginLeft: space.small,
  },
});

const PartyWizard: React.FC = () => {
  const [ session, loading ] = useSession();

  if (loading) {
    return null;
  }

  if (session) {
    const firstName = session.user.name.split(' ')[0];
    return (
      <BasicLayout>
        <Head><title>Party Wizard | The Electric Lounge</title></Head>
        <Logo />
        <Welcome>
          <Image width="40" height="40" src="/party-wizard.gif" />
          <span>Hello, {firstName}. You&apos;re ready to rock! 🤘</span>
        </Welcome>
        <Accordion heading={'Spotify API'}>
          <Panels.SpotifyApiCheck />
        </Accordion>
        <Accordion heading={'For those about to rock...'}>
          We salute you!
        </Accordion>
        <Accordion heading={'Here at the Electric Lounge...'}>
          No one&apos;s afraid to laugh.
        </Accordion>
      </BasicLayout>
    )
  }

  return (
    <BasicLayout>
      <Head>
        <title>Party Wizard | The Electric Lounge</title>
      </Head>
      <Logo />
      <div>
        {'The Party Wizard awaits, but you need to '}
        <a role="button" onClick={() => signIn()}>sign in</a>
        {' before you can rock out.'}
      </div>
    </BasicLayout>
  )
}

export default PartyWizard;
