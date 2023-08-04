'use client';

import React from 'react';

import { FormTwoColumns } from 'components/FormTwoColumns';
import { MenuTop } from 'components/MenuTop';
import { SmallMediumText } from 'components/Text';

import styles from './scale.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataScaleModel } from 'models/DataScaleModel';
import dataScale from 'tests/mocks/dataScale'; //mock de teste de dados

export default function ScalePage(): JSX.Element {
  const [selectedItem, setSelectedItem] = React.useState<string>(''); //array de string vazio

  function handleItemSelection(item: DataScaleModel) {
    setSelectedItem(item.name);
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyScale}>
        <div style={{ width: '30%' }}>
          <FormTwoColumns
            headers={Strings.headersScale}
            data={dataScale}
            onItemClick={handleItemSelection}
          />
        </div>
        <div className={styles.formInserScale}>
          <div>
            <SmallMediumText
              text={Strings.scheduleConfirmation + ': ' + `${selectedItem}`}
              style={{ textAlign: 'left', lineHeight: 2 }}
              bold={true}
              color={Colors.gray90}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
