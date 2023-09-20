'use client';

import React from 'react';

import { MenuTop } from 'components/MenuTop';
import { SmallMediumText } from 'components/Text';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

export default function ListOrdersPage(): JSX.Element {
  return (
    <React.Fragment>
      <MenuTop />
      <div>
        <div>
          <SmallMediumText
            text={Strings.kitcheOrders}
            color={Colors.black}
            bold={true}
          />
        </div>
        <div>
          <div></div>
        </div>
      </div>
    </React.Fragment>
  );
}
