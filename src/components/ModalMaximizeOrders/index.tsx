/* eslint-disable @typescript-eslint/no-unused-vars */
import Modal from 'react-bootstrap/Modal';

import { Icon, TypeIcon } from 'components/Icone';
import { MediumText, MediumText2 } from 'components/Text';

import styles from './modalmaximeorders.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { format } from 'date-fns';
import { DataOrdersModel } from 'models/DataOrdersModel';
import { updateStatusOrder } from 'services/orders';

type Props = {
  onHide: () => void;
  dataOrdersWaiting: DataOrdersModel[] | undefined;
  dataOrdersPreparation: DataOrdersModel[] | undefined;
  dataOrdersReady: DataOrdersModel[] | undefined;
  dataOrdersDelivered: DataOrdersModel[] | undefined;
  show: boolean;
};

export default function ModalMaximizeOrders({
  dataOrdersWaiting,
  dataOrdersPreparation,
  dataOrdersReady,
  dataOrdersDelivered,
  onHide,
  show,
  ...props
}: Props & { show: boolean }) {
  async function changeStatus(idOrder: number, nextStatus: number) {
    const response = await updateStatusOrder(idOrder, nextStatus);
    if (response !== null) {
      return response;
    }
  }

  return (
    <Modal show={show} fullscreen={true} onHide={onHide}>
      <Modal.Body>
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
                text={Strings.retract}
                color={Colors.gray60}
                bold={false}
                style={{ lineHeight: 0, margin: 0 }}
              />
              <button className={styles.btnExpand} onClick={onHide}>
                <Icon
                  typeIcon={TypeIcon.Minimize}
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
                      <div className={styles.divOrderNumber}>
                        <MediumText2
                          text={item.patient.name}
                          color={Colors.black}
                          bold={true}
                          style={{ lineHeight: '5px' }}
                        />
                      </div>
                      <div className="d-flex justify-content-around w-100 mt-4">
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
                      <div className={styles.divOrderNumber}>
                        <MediumText2
                          text={item.patient.name}
                          color={Colors.black}
                          bold={true}
                          style={{ lineHeight: '5px' }}
                        />
                      </div>
                      <div className="d-flex justify-content-around w-100 mt-4">
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
                      <div className={styles.divOrderNumber}>
                        <MediumText2
                          text={item.patient.name}
                          color={Colors.black}
                          bold={true}
                          style={{ lineHeight: '5px' }}
                        />
                      </div>
                      <div className="d-flex justify-content-around w-100 mt-4">
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
                    <div key={index} className={styles.divOrder}>
                      <div className={styles.divOrderNumber}>
                        <MediumText2
                          text={item.patient.name}
                          color={Colors.black}
                          bold={true}
                          style={{ lineHeight: '5px' }}
                        />
                      </div>
                      <div className="d-flex justify-content-around w-100 mt-4">
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
      </Modal.Body>
    </Modal>
  );
}
