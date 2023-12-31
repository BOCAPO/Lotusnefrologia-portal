'use client';

import React from 'react';
import Modal from 'react-bootstrap/Modal';

import { Icon, TypeIcon } from 'components/Icone';
import { SpinnerLoading } from 'components/Spinner';
import { MediumText2, SmallMediumText } from 'components/Text';

import styles from './modalorderdetails.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { format } from 'date-fns';
import { DataOrdersModel } from 'models/DataOrdersModel';
import { getHistoryOrderById } from 'services/orders';

type Props = {
  onHide: () => void;
  show: boolean;
  order?: DataOrdersModel | null;
};

export default function ModalOrderDetails({
  onHide,
  order,
  ...props
}: Props & { show: boolean }) {
  const [orderHistory, setOrderHistory] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (order !== null && order !== undefined) {
      getHistoryOrder();
    }
  }, [order]);

  async function getHistoryOrder() {
    const response = await getHistoryOrderById(
      order !== undefined && order ? order.id : ''
    );
    if (response !== null) {
      setOrderHistory(response.data);
      setIsLoading(false);
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      centered
      show={props.show}
      className={styles.headBoxSchedule}
      onHide={() => {
        onHide();
        setIsLoading(true);
      }}
    >
      <Modal.Header
        closeButton
        className="d-flex align-items-center justify-content-center flex-row"
        style={{
          height: '80px'
        }}
      >
        <MediumText2
          text={Strings.orderDetails}
          bold={true}
          color={Colors.gray90}
          style={{
            lineHeight: 0,
            textAlign: 'left',
            width: '100%',
            margin: 0,
            border: 'none !important'
          }}
        />
      </Modal.Header>
      <Modal.Body className={styles.modalBoxSchedule}>
        {order && (
          <div className={styles.divOrdersDetails}>
            <div className={styles.divOrderNumber}>
              <MediumText2
                text={order?.patient.name}
                color={Colors.black}
                bold={true}
                style={{ lineHeight: '5px' }}
              />
            </div>
            <div className={styles.divOrderDate}>
              <Icon
                typeIcon={TypeIcon.Calendar}
                size={20}
                color={Colors.gray55}
              />
              <MediumText2
                text={format(new Date(order?.start), 'dd/MM/yyyy')}
                color={Colors.gray55}
                bold={true}
                style={{ lineHeight: 0, margin: 0 }}
              />
            </div>
            <div className={styles.divDishesOrderTitle}>
              <MediumText2
                text={Strings.order}
                color={Colors.greenLight3}
                bold={true}
                style={{ lineHeight: '5px' }}
              />
            </div>
            {order?.dishes.map((dish, index) => (
              <div key={index} className={styles.divDishesOrder}>
                <MediumText2
                  text={dish.name}
                  color={Colors.gray90}
                  bold={false}
                  style={{ lineHeight: '5px' }}
                />
                <MediumText2
                  text={Strings.oneX}
                  color={Colors.gray90}
                  bold={true}
                  style={{ lineHeight: '5px' }}
                />
              </div>
            ))}
          </div>
        )}
        <div className={styles.divOrdersTimeHistory}>
          <div className={styles.divDishesOrderTitle}>
            <MediumText2
              text={Strings.timeLine}
              color={Colors.greenLight3}
              bold={true}
              style={{ lineHeight: '5px' }}
            />
          </div>
          {isLoading ? (
            <SpinnerLoading />
          ) : (
            orderHistory?.map((history: any, index: number) => (
              <div key={index} className="d-flex w-100 my-3">
                <div className="d-flex justify-content-between w-100">
                  <SmallMediumText
                    text={history?.status_description}
                    color={Colors.black}
                    bold={true}
                    style={{ lineHeight: '5px', margin: 0 }}
                  />
                  <SmallMediumText
                    text={
                      history?.duration === null ||
                      history?.duration === '' ||
                      history.duration === undefined
                        ? 'Em curso'
                        : history?.duration
                    }
                    color={Colors.gray55}
                    bold={true}
                    style={{ lineHeight: 0, margin: 0 }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
