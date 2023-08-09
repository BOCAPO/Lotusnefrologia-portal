import React from 'react';
import { Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { SmallMediumText } from 'components/Text';

import styles from './modal.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';

type Props = {
  onHide: () => void;
  show: boolean;
  specialists: DataSpecialistsModel[];
};

type DataProps = {
  [name: string]: string | number;
};

export default function ModalBoxSchedule({
  onHide,
  specialists,
  ...props
}: Props & { show: boolean }) {
  const [specialties, setSpecialties] = React.useState<any>(null);
  const [isLoadingSpecialties, setIsLoadingSpecialties] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  function handleSubmitAppoitment(data: DataProps) {
    data.name = 'teste';
    onHide();
  }

  async function getSpecialties(specialistId: number) {
    setIsLoadingSpecialties(true);
    const specialistSelected = specialists.filter((item) => {
      return item.id === specialistId;
    });
    const specialtiesUpdated = specialistSelected[0].specialties;
    setSpecialties(
      specialtiesUpdated
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description))
    );
    setIsLoadingSpecialties(false);
  }

  return (
    <Modal
      {...props}
      size="lg"
      centered
      show={props.show}
      className={styles.headBoxSchedule}
    >
      <Modal.Body className={styles.modalBoxSchedule}>
        <SmallMediumText
          text={Strings.schedule}
          bold={true}
          color={Colors.gray90}
          style={{ lineHeight: 2, textAlign: 'left', width: '100%' }}
        />
        <div className={styles.twoColumns} style={{ marginBottom: '15px' }}>
          <InputForm
            control={control}
            placeholder={Strings.description}
            type="text"
            name="description"
            containerStyle={{
              width: '95%',
              height: '40px',
              marginRight: '5%'
            }}
            error={errors.descriptionRequired?.message?.toString()}
            style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
          />
          <Form.Select
            aria-label="Default select example"
            style={{ width: '25%' }}
          >
            <option value="1">
              <Form.Control
                type="color"
                id="exampleColorInput"
                defaultValue="#563d7c"
                title="Choose your color"
              />
            </option>
            <option value="2">
              <Form.Control
                type="color"
                id="exampleColorInput"
                defaultValue="#563d7c"
                title="Choose your color"
              />
            </option>
            <option value="3">
              <Form.Control
                type="color"
                id="exampleColorInput"
                defaultValue="#563d7c"
                title="Choose your color"
              />
            </option>
          </Form.Select>
        </div>
        <div className={styles.twoColumns} style={{ marginBottom: '15px' }}>
          <InputForm
            control={control}
            placeholder={Strings.pacient}
            type="text"
            containerStyle={{
              width: '100%',
              height: '40px'
            }}
            name="pacient"
            error={errors.pacientRequired?.message?.toString()}
            style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
          />
        </div>
        <div className={styles.twoColumns} style={{ marginBottom: '15px' }}>
          <select
            onChange={(event) => {
              getSpecialties(Number(event.target.value));
            }}
          >
            <option value="">Selecione o especialista</option>
            {specialists?.map((specialist: DataSpecialistsModel) => {
              return (
                <option key={specialist.id} value={specialist.id}>
                  {specialist.name}
                </option>
              );
            })}
          </select>
          <select>
            {isLoadingSpecialties ? (
              <option value="">Carregando...</option>
            ) : (
              <>
                <option value="">Selecione a especialidade</option>
                {specialties &&
                  specialties?.map((specialty: DataSpecialtiesModel) => {
                    return (
                      <option key={specialty.id} value={specialty.id}>
                        {specialty.description}
                      </option>
                    );
                  })}
              </>
            )}
          </select>
        </div>
        <div className={styles.twoColumns} style={{ marginBottom: '15px' }}>
          <InputForm
            control={control}
            placeholder={Strings.date}
            type="date"
            name="date"
            containerStyle={{
              width: '47.5%',
              height: '40px',
              marginRight: '10%'
            }}
            error={errors.dateRequired?.message?.toString()}
            style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
          />
          <InputForm
            control={control}
            placeholder={Strings.hour}
            type="time"
            name="hour"
            containerStyle={{
              width: '47.5%',
              height: '40px'
            }}
            error={errors.hourRequired?.message?.toString()}
            style={{ height: '40px', padding: '5px 10px', fontSize: 12 }}
          />
        </div>
        <div className={styles.observation}>
          <textarea
            placeholder="Observação"
            className={styles.observationInput}
            name="observation"
            style={{
              width: '100%',
              fontSize: 12
            }}
          ></textarea>
        </div>
        <div className={styles.boxScheduleBtns}>
          <div className={styles.btnDefault}>
            <Button
              title={Strings.save}
              type="secondary"
              onClick={handleSubmit(handleSubmitAppoitment)}
            />
          </div>
          <div className={styles.btnDefault}>
            <Button title={Strings.cancel} type="cancel" onClick={onHide} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
