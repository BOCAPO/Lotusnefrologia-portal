'use client';

import React from 'react';

import { FormTwoColumns } from 'components/FormTwoColumns';
import { MenuTop } from 'components/MenuTop';

import { Strings } from 'assets/Strings';
import dataScale from 'tests/mocks/dataScale'; //mock de teste de dados

export default function ScalePage(): JSX.Element {
  return (
    <React.Fragment>
      <MenuTop />
      <div>
        <FormTwoColumns headers={Strings.headersScale} data={dataScale} />
      </div>
    </React.Fragment>
  );
}
