/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { InputForm } from 'components/Input';
import { SelectForm } from 'components/SelectForm';
import { SmallMediumText } from 'components/Text';

import styles from './modalboxexams.module.css';

import { schema } from './schema';

import { yupResolver } from '@hookform/resolvers/yup';
import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataExamsModel } from 'models/DataExamsModel';
import { DataExamsTypeModel } from 'models/DataExamsTypeModel';
import { DataPatientsModel } from 'models/DataPatientsModel';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { createExam } from 'services/exams';

type Props = {
  onHide: () => void;
  show: boolean;
  specialists: DataSpecialistsModel[];
  patients: DataPatientsModel[];
  examsTypes: DataExamsTypeModel[];
  onUpdate?: (value: number) => void;
};

type DataProps = {
  [name: string]: string | number;
};

export default function ModalBoxExams({
  onHide,
  specialists,
  patients,
  examsTypes,
  onUpdate,
  ...props
}: Props & { show: boolean }) {
  const [isVisibleListPatients, setIsVisibleListPatients] =
    React.useState(false);
  const [patient, setPatient] = React.useState<any>(null);
  const [filteredProducts, setFilteredProducts] = React.useState<any>(null);
  const [selectedSpecialist, setSelectedSpecialist] = React.useState<number>(0);
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [selectedExameType, setSelectedExameType] = React.useState<number>(0);
  const [files, setFiles] = React.useState([] as any);

  const onDrop = (acceptedFiles: any) => {
    setFiles(acceptedFiles);
  };

  const filesList = files.map((file: any) => (
    <p key={file.name}>
      {file.name} - {file.size} bytes
    </p>
  ));

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['png'],
      'image/jpeg': ['jpeg', 'jpg'],
      'application/pdf': ['pdf'],
      'application/msword': ['doc', 'docx']
    },
    maxFiles: 1
  });
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

  const handleCleanAndHide = () => {
    setSelectedDate('');
    setSelectedSpecialist(0);
    setSelectedExameType(0);
    setPatient(null);
    setValue('pacient', '');
    setValue('date', '');
    setValue('specialist', '');
    setValue('exameType', '');
    setFiles([]);
    onHide();
  };
  const handleClean = () => {
    setSelectedDate('');
    setSelectedSpecialist(0);
    setSelectedExameType(0);
    setPatient(null);
    setValue('pacient', '');
    setValue('date', '');
    setValue('specialist', '');
    setValue('exameType', '');
    setFiles([]);
  };

  async function fileToDataURI(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataURI = event?.target?.result;
        resolve(dataURI);
      };

      reader.onerror = (event) => {
        reject(event?.target?.error);
      };

      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(data: DataProps) {
    const fileBase64 = await fileToDataURI(files[0]);
    const newExam = {
      patient_id: patient.id as number,
      examType_id: Number(selectedExameType),
      specialist_id: Number(selectedSpecialist),
      file_name: files[0].name,
      date: selectedDate,
      path: files[0].path,
      extension: files[0].type,
      file: fileBase64
    } as DataExamsModel;

    const response = await createExam(newExam);
    if (response !== null) {
      onUpdate && onUpdate(1);
      handleCleanAndHide();
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
        <div className={styles.containerDropzone}>
          <section>
            <div {...getRootProps({ className: 'dropzone' })}>
              {filesList.length === 0 ? (
                <React.Fragment>
                  <Icon
                    typeIcon={TypeIcon.Upload}
                    size={30}
                    color={Colors.greenDark2}
                  />
                  <input {...getInputProps()} />
                  <p>{Strings.selectOrDropFile}</p>
                  <p>{Strings.typesFilesAcceptedExams}</p>
                </React.Fragment>
              ) : (
                <div>{filesList}</div>
              )}
            </div>
          </section>
        </div>

        <div className={styles.boxScheduleBtns}>
          <div className={styles.btnDefault}>
            <Button
              title={Strings.import}
              type="secondary"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
          <div className={styles.btnDefault}>
            <Button
              title={Strings.clear}
              type="cancel"
              onClick={() => {
                handleClean();
              }}
            />
          </div>
          <div className={styles.btnDefault}>
            <Button
              title={Strings.cancel}
              type="cancel"
              onClick={() => handleCleanAndHide()}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
