/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { InputForm } from 'components/Input';
import { SelectForm } from 'components/SelectForm';
import { SmallMediumText } from 'components/Text';

import styles from './modalboxexams.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataExamsTypeModel } from 'models/DataExamsTypeModel';
import { DataPatientsModel } from 'models/DataPatientsModel';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';

type Props = {
  onHide: () => void;
  show: boolean;
  specialists: DataSpecialistsModel[];
  patients: DataPatientsModel[];
  examsTypes: DataExamsTypeModel[];
};

type DataProps = {
  [name: string]: string | number;
};

export default function ModalBoxExams({
  onHide,
  specialists,
  patients,
  examsTypes,
  ...props
}: Props & { show: boolean }) {
  const [isVisibleListPatients, setIsVisibleListPatients] =
    React.useState(false);
  const [patient, setPatient] = React.useState<any>(null);
  const [filteredProducts, setFilteredProducts] = React.useState<any>(null);
  const [selectedSpecialist, setSelectedSpecialist] = React.useState<number>(0);
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [selectedExameType, setSelectedExameType] = React.useState<number>(0);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<DataProps>({
    resolver: yupResolver(schema)
  });

  const handleFilteredPatients = (
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

  const handleGetSpecialist = (selectedSpecialistCode: any) => {
    setSelectedSpecialist(selectedSpecialistCode);
  };

  const handleDataSelected = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedDate(value);
  };

  const handleGetExameType = (selectedExameType: any) => {
    setSelectedExameType(selectedExameType);
  };

  // async function handleSubmitAppoitment(data: DataProps) {
  //   const newAppoitment = {
  //     specialist_id: Number(selectedSpecialist),
  //     patient_id: patient.id as number,
  //     unit_id: Number(selectedUnit),
  //     specialty_id: selectedSpecialty,
  //     schedule_id: Number(selectedScheduleId),
  //     appointment_status: 1,
  //     observation: observation,
  //     tag_id: selectedColor,
  //     status: 0
  //   };

  //   const response = await createAppointment(newAppoitment);
  //   if (response !== null) {
  //     onHide();
  //   }
  // }

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
          text={Strings.insertExam}
          bold={true}
          color={Colors.gray90}
          style={{ lineHeight: 2, textAlign: 'left', width: '100%' }}
        />
        <div className={styles.twoColumns} style={{ marginBottom: '15px' }}>
          <SelectForm
            control={control}
            item={Strings.specialist}
            name="specialist"
            data={specialists}
            containerStyle={{ width: '100%' }}
            error={errors.specialistRequired?.message?.toString()}
            onSelectChange={handleGetSpecialist}
          />
        </div>
        <div className={styles.twoColumns} style={{ marginBottom: '15px' }}>
          <InputForm
            control={control}
            placeholder={Strings.pacient}
            label={Strings.pacient}
            type="text"
            containerStyle={{
              width: '100%',
              height: '40px'
            }}
            name="pacient"
            error={errors.pacientRequired?.message?.toString()}
            className={styles.inputNewAppointment}
            onKeyUp={handleFilteredPatients}
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
          <InputForm
            control={control}
            placeholder={Strings.date}
            label={Strings.date}
            type="date"
            name="date"
            containerStyle={{
              width: '45%',
              height: '40px',
              marginRight: '8%'
            }}
            error={errors.dateRequired?.message?.toString()}
            className={styles.inputNewAppointment}
            onBlur={handleDataSelected}
          />

          <SelectForm
            control={control}
            item={Strings.type}
            name="exameType"
            data={examsTypes}
            containerStyle={{ width: '45%' }}
            error={errors.examsTypes?.message?.toString()}
            onSelectChange={handleGetExameType}
          />
        </div>

        <div className={styles.boxScheduleBtns}>
          <div className={styles.btnDefault}>
            <Button
              title={Strings.save}
              type="secondary"
              // onClick={handleSubmit(handleSubmitAppoitment)}
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
