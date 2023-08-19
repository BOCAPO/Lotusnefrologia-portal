'use client';

import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { MenuTop } from 'components/MenuTop';

import styles from './appointment.module.css';

export default function AppointmentsPage(): JSX.Element {
  const [key, setKey] = React.useState('home');

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyAppointments}>
        <div>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k!)}
            className="mb-3"
          >
            <Tab eventKey="home" title="Agendadas">
              Tab content for Home
            </Tab>
            <Tab eventKey="profile" title="Pendentes">
              Tab content for Profile
            </Tab>
            <Tab eventKey="contact" title="Canceladas">
              Tab content for Contact
            </Tab>
          </Tabs>
        </div>
        <div></div>
      </div>
    </React.Fragment>
  );
}
