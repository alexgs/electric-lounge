/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { signIn, useSession } from 'next-auth/client';
import * as React from 'react';

import { BasicLayout } from 'components/layouts';

const PartyWizard: React.FC = () => {
  const [ session, loading ] = useSession();

  if (loading) {
    return null;
  }

  if (session) {
    const firstName = session.user.name.split(' ')[0];
    return (
      <BasicLayout>
        <div>Hello, {firstName}. You&apos;re ready to rock! 🤘</div>
      </BasicLayout>
    )
  }

  return (
    <BasicLayout>
      <div>You need to <a role="button" onClick={() => signIn()}>sign in</a> before you can rock out.</div>
    </BasicLayout>
  )
}

export default PartyWizard;
