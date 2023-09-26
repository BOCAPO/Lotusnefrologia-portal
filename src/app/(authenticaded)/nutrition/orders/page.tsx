'use client';

import React from 'react';

import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalMaximizeOrders from 'components/ModalMaximizeOrders';
import ModalOrderDetails from 'components/ModalOrderDetails';
import { MediumText, MediumText2 } from 'components/Text';

import styles from './orders.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { format } from 'date-fns';
import { DataOrdersModel } from 'models/DataOrdersModel';
import { getOrdersToday, updateStatusOrder } from 'services/orders';

export default function ListOrdersPage(): JSX.Element {
  const [dataOrdersWaiting, setDataOrdersWaiting] =
    React.useState<DataOrdersModel[]>();
  const [dataOrdersPreparation, setDataOrdersPreparation] =
    React.useState<DataOrdersModel[]>();
  const [dataOrdersReady, setDataOrdersReady] =
    React.useState<DataOrdersModel[]>();
  const [dataOrdersDelivered, setDataOrdersDelivered] =
    React.useState<DataOrdersModel[]>();
  const [showModalOrderDetails, setShowModalOrderDetails] =
    React.useState(false);
  const [showModalMaximizeOrders, setShowModalMaximizeOrders] =
    React.useState(false);
  const [order, setOrder] = React.useState<DataOrdersModel>();

  const fetchOrders = async () => {
    await getOrders();
  };

  React.useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, []);

  async function getOrders() {
    const response = await getOrdersToday();
    const dataUpdated: any = [];
    if (Array.isArray(response.data)) {
      response?.data?.map((item) => {
        dataUpdated.push(item);
      }) as unknown as DataOrdersModel[];
    }

    const dataStatusWaiting = dataUpdated.filter(
      (item: DataOrdersModel) => item.order_status === 0
    );

    dataStatusWaiting.sort((a: DataOrdersModel, b: DataOrdersModel) => {
      if (a.start < b.start) {
        return 1;
      }
      if (a.start > b.start) {
        return -1;
      }
      return 0;
    });

    const dataStatusPreparation = dataUpdated.filter(
      (item: DataOrdersModel) => item.order_status === 1
    );

    dataStatusPreparation.sort((a: DataOrdersModel, b: DataOrdersModel) => {
      if (a.start < b.start) {
        return 1;
      }
      if (a.start > b.start) {
        return -1;
      }
      return 0;
    });

    const dataStatusReady = dataUpdated.filter(
      (item: DataOrdersModel) => item.order_status === 2
    );

    dataStatusReady.sort((a: DataOrdersModel, b: DataOrdersModel) => {
      if (a.start < b.start) {
        return 1;
      }
      if (a.start > b.start) {
        return -1;
      }
      return 0;
    });

    const dataStatusDelivered = dataUpdated.filter(
      (item: DataOrdersModel) => item.order_status === 3
    );

    dataStatusDelivered.sort((a: DataOrdersModel, b: DataOrdersModel) => {
      if (a.start < b.start) {
        return 1;
      }
      if (a.start > b.start) {
        return -1;
      }
      return 0;
    });

    setDataOrdersWaiting(dataStatusWaiting);
    setDataOrdersPreparation(dataStatusPreparation);
    setDataOrdersReady(dataStatusReady);
    setDataOrdersDelivered(dataStatusDelivered);
  }

  async function changeStatus(idOrder: number, nextStatus: number) {
    const response = await updateStatusOrder(idOrder, nextStatus);
    if (response !== null) {
      getOrders();
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyOrdersList}>
        <div className={styles.divTitleOrders}>
          <MediumText2
            text={Strings.kitcheOrders}
            color={Colors.black}
            bold={true}
            style={{ lineHeight: '5px' }}
          />
          <div className="d-flex justify-content-center align-items-center">
            <MediumText
              text={Strings.expand}
              color={Colors.gray60}
              bold={false}
              style={{ lineHeight: 0, margin: 0 }}
            />
            <button
              className={styles.btnExpand}
              onClick={() => setShowModalMaximizeOrders(true)}
            >
              <Icon
                typeIcon={TypeIcon.Maximize}
                size={30}
                color={Colors.gray55}
                style={{ cursor: 'pointer' }}
              />
            </button>
          </div>
        </div>
        <div className={styles.divColumnsOrders}>
          <div className={styles.divColumnOrdes}>
            <div className="d-flex flex-column justify-content-start w-100">
              <MediumText2
                text={Strings.waiting}
                color={Colors.greenLight3}
                bold={true}
                style={{ lineHeight: '5px', padding: '0 2%' }}
              />
            </div>
            {dataOrdersWaiting && dataOrdersWaiting?.length > 0 ? (
              dataOrdersWaiting?.map((item, index) => {
                return (
                  <div key={index} className={styles.divOrder}>
                    <div
                      className={styles.divOrderNumber}
                      onClick={() => {
                        setShowModalOrderDetails(true);
                        setOrder(item);
                      }}
                    >
                      <MediumText2
                        text={item.patient.name}
                        color={Colors.black}
                        bold={true}
                        style={{ lineHeight: '5px' }}
                      />
                    </div>
                    <div className="d-flex justify-content-around w-100 mt-4">
                      <div
                        className={styles.divOrderDate}
                        onClick={() => {
                          setShowModalOrderDetails(true);
                          setOrder(item);
                        }}
                      >
                        <Icon
                          typeIcon={TypeIcon.Calendar}
                          size={20}
                          color={Colors.gray55}
                        />
                        <MediumText2
                          text={format(new Date(item.start), 'dd/MM/yyyy')}
                          color={Colors.gray55}
                          bold={true}
                          style={{ lineHeight: '5px' }}
                        />
                      </div>
                      <div className={styles.divChangeStatus}>
                        <button
                          onClick={() => changeStatus(Number(item.id), 1)}
                        >
                          <Icon
                            typeIcon={TypeIcon.ArrowRight}
                            size={20}
                            color={Colors.gray55}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="d-flex justify-content-center align-items-center mt-5">
                <MediumText2
                  text={Strings.noOrders}
                  color={Colors.gray55}
                  bold={true}
                  style={{ lineHeight: '5px' }}
                />
              </div>
            )}
          </div>
          <div className={styles.divColumnOrdes}>
            <div className="d-flex flex-column justify-content-start w-100">
              <MediumText2
                text={Strings.inPreparing}
                color={Colors.greenLight3}
                bold={true}
                style={{ lineHeight: '5px', padding: '0 2%' }}
              />
            </div>
            {dataOrdersPreparation && dataOrdersPreparation?.length > 0 ? (
              dataOrdersPreparation?.map((item, index) => {
                return (
                  <div key={index} className={styles.divOrder}>
                    <div
                      className={styles.divOrderNumber}
                      onClick={() => {
                        setShowModalOrderDetails(true);
                        setOrder(item);
                      }}
                    >
                      <MediumText2
                        text={item.patient.name}
                        color={Colors.black}
                        bold={true}
                        style={{ lineHeight: '5px' }}
                      />
                    </div>
                    <div className="d-flex justify-content-around w-100 mt-4">
                      <div
                        className={styles.divOrderDate}
                        onClick={() => {
                          setShowModalOrderDetails(true);
                          setOrder(item);
                        }}
                      >
                        <Icon
                          typeIcon={TypeIcon.Calendar}
                          size={20}
                          color={Colors.gray55}
                        />
                        <MediumText2
                          text={format(new Date(item.start), 'dd/MM/yyyy')}
                          color={Colors.gray55}
                          bold={true}
                          style={{ lineHeight: '5px' }}
                        />
                      </div>
                      <div className={styles.divChangeStatus}>
                        <button
                          onClick={() => changeStatus(Number(item.id), 2)}
                        >
                          <Icon
                            typeIcon={TypeIcon.ArrowRight}
                            size={20}
                            color={Colors.gray55}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="d-flex justify-content-center align-items-center mt-5">
                <MediumText2
                  text={Strings.noOrders}
                  color={Colors.gray55}
                  bold={true}
                  style={{ lineHeight: '5px' }}
                />
              </div>
            )}
          </div>
          <div className={styles.divColumnOrdes}>
            <div className="d-flex flex-column justify-content-start w-100">
              <MediumText2
                text={Strings.ready}
                color={Colors.greenLight3}
                bold={true}
                style={{ lineHeight: '5px', padding: '0 2%' }}
              />
            </div>
            {dataOrdersReady && dataOrdersReady?.length > 0 ? (
              dataOrdersReady?.map((item, index) => {
                return (
                  <div key={index} className={styles.divOrder}>
                    <div
                      className={styles.divOrderNumber}
                      onClick={() => {
                        setShowModalOrderDetails(true);
                        setOrder(item);
                      }}
                    >
                      <MediumText2
                        text={item.patient.name}
                        color={Colors.black}
                        bold={true}
                        style={{ lineHeight: '5px' }}
                      />
                    </div>
                    <div className="d-flex justify-content-around w-100 mt-4">
                      <div
                        className={styles.divOrderDate}
                        onClick={() => {
                          setShowModalOrderDetails(true);
                          setOrder(item);
                        }}
                      >
                        <Icon
                          typeIcon={TypeIcon.Calendar}
                          size={20}
                          color={Colors.gray55}
                        />
                        <MediumText2
                          text={format(new Date(item.start), 'dd/MM/yyyy')}
                          color={Colors.gray55}
                          bold={true}
                          style={{ lineHeight: '5px' }}
                        />
                      </div>
                      <div className={styles.divChangeStatus}>
                        <button
                          onClick={() => changeStatus(Number(item.id), 3)}
                        >
                          <Icon
                            typeIcon={TypeIcon.ArrowRight}
                            size={20}
                            color={Colors.gray55}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="d-flex justify-content-center align-items-center mt-5">
                <MediumText2
                  text={Strings.noOrders}
                  color={Colors.gray55}
                  bold={true}
                  style={{ lineHeight: '5px' }}
                />
              </div>
            )}
          </div>
          <div className={styles.divColumnOrdes}>
            <div className="d-flex flex-column justify-content-start w-100">
              <MediumText2
                text={Strings.delivered}
                color={Colors.greenLight3}
                bold={true}
                style={{ lineHeight: '5px', padding: '0 2%' }}
              />
            </div>
            {dataOrdersDelivered && dataOrdersDelivered?.length > 0 ? (
              dataOrdersDelivered?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={styles.divOrder}
                    onClick={() => {
                      setShowModalOrderDetails(true);
                      setOrder(item);
                    }}
                  >
                    <div className={styles.divOrderNumber}>
                      <MediumText2
                        text={item.patient.name}
                        color={Colors.black}
                        bold={true}
                        style={{ lineHeight: '5px' }}
                      />
                    </div>
                    <div
                      className="d-flex justify-content-around w-100 mt-4"
                      onClick={() => {
                        setShowModalOrderDetails(true);
                        setOrder(item);
                      }}
                    >
                      <div className={styles.divOrderDate}>
                        <Icon
                          typeIcon={TypeIcon.Calendar}
                          size={20}
                          color={Colors.gray55}
                        />
                        <MediumText2
                          text={format(new Date(item.start), 'dd/MM/yyyy')}
                          color={Colors.gray55}
                          bold={true}
                          style={{ lineHeight: '5px' }}
                        />
                      </div>
                      <div className={styles.divChangeStatus}>
                        <button style={{ visibility: 'hidden' }}>
                          <Icon
                            typeIcon={TypeIcon.ArrowRight}
                            size={20}
                            color={Colors.gray55}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="d-flex justify-content-center align-items-center mt-5">
                <MediumText2
                  text={Strings.noOrders}
                  color={Colors.gray55}
                  bold={true}
                  style={{ lineHeight: '5px' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalOrderDetails
        show={showModalOrderDetails}
        onHide={() => setShowModalOrderDetails(false)}
        order={order !== undefined ? order : null}
      />
      <ModalMaximizeOrders
        show={showModalMaximizeOrders}
        onHide={() => setShowModalMaximizeOrders(false)}
        dataOrdersWaiting={dataOrdersWaiting}
        dataOrdersPreparation={dataOrdersPreparation}
        dataOrdersReady={dataOrdersReady}
        dataOrdersDelivered={dataOrdersDelivered}
      />
    </React.Fragment>
  );
}
