'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from 'components/Button';
import { MenuTop } from 'components/MenuTop';
import { MediumText2 } from 'components/Text';

import styles from './attendance.module.css';

import Chat from 'assets/images/icons/1x/chat_1.png';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';

export default function HomeChat(): JSX.Element {
  const router = useRouter();

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyHomeChat}>
        <div className={styles.headerHomeChat}>
          <Image src={Chat} alt="Logo Chat" style={{ scale: '0.7' }} />
          <MediumText2
            text={Strings.chatAttendance}
            color={Colors.greenDark}
            style={{ lineHeight: '2px' }}
            bold={true}
          />
          <div style={{ width: '10%', marginTop: '2vh' }}>
            <Button
              title={Strings.stayOnLine}
              type="onLine"
              onClick={() => {
                router.push('/chat/rooms');
              }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
