import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import ColorSelector from 'components/ColorSelector';
import { InputForm } from 'components/Input';
import { SelectForm } from 'components/SelectForm';
import { SmallMediumText } from 'components/Text';

import styles from './modalboxschedule.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataAppoitmentTag } from 'models/DataAppoitmentTag';
import { DataPatientsModel } from 'models/DataPatientsModel';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { createAppointment } from 'services/appointments';

type Props = {
  onHide: () => void;
  show: boolean;
  specialists: DataSpecialistsModel[];
  patients: DataPatientsModel[];
  tags: DataAppoitmentTag[];
  units: DataUnitsModel[];
};

type DataProps = {
  [name: string]: string | number;
};

export default function ModalBoxSchedule({
  onHide,
  specialists,
  patients,
  units,
  tags,
  ...props
}: Props & { show: boolean }) {
  const [specialties, setSpecialties] = React.useState<any>(null);
  const [isLoadingSpecialties, setIsLoadingSpecialties] = React.useState(false);
  const [isVisibleListPatients, setIsVisibleListPatients] =
    React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [patient, setPatient] = React.useState<any>(null);
  const [filteredProducts, setFilteredProducts] = React.useState<any>(null);
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  const handleFilteredProduct = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    if (value.length >= 3) setIsVisibleListPatients(true);
    else setIsVisibleListPatients(false);

    value.length >= 3
      ? setFilteredProducts(
          patients?.filter((item: DataPatientsModel) =>
            item.name.toUpperCase().includes(value.toUpperCase())
          )
        )
      : [];
  };

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

  async function handleSubmitAppoitment(data: DataProps) {
    const newAppoitment = {
      specialist_id: 1,
      patient_id: patient.id as number,
      unit_id: 1,
      specialty_id: 1,
      schedule_id: 1,
      appointment_status: 1,
      observation: data.observation.toString(),
      tag_id: '1',
      status: 0
    };

    try {
      const response = await createAppointment(newAppoitment);
      if (response !== null) {
        onHide();
      }
    } catch (error) {
      //console.log('Error ao criar agendamento: ', error);
    }
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
          <SelectForm
            control={control}
            name="description"
            containerStyle={{
              width: '70%',
              height: '40px'
            }}
            data={units}
            error={errors.descriptionRequired?.message?.toString()}
          />
          <ColorSelector colors={tags} />
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
            className={styles.inputNewAppointment}
            onKeyUp={handleFilteredProduct}
          />
        </div>
        {isVisibleListPatients &&
          patients !== null &&
          patients !== undefined && (
            <>
              <div className={styles.listPatients}>
                {filteredProducts !== undefined && filteredProducts.length ? (
                  filteredProducts?.map((patient: DataPatientsModel) => {
                    return (
                      <div
                        key={patient.id}
                        className={styles.patient}
                        onClick={() => {
                          setPatient(patient);
                          setValue('pacient', patient.name);
                          setIsVisibleListPatients(false);
                        }}
                      >
                        <p style={{ margin: '2px 0' }}>{patient.name}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.patient}>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}>
                      Nenhum paciente encontrado.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
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
            className={styles.inputNewAppointment}
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
            className={styles.inputNewAppointment}
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
