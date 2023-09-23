'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import styles from './imageinput.module.css';

interface ImageInputProps {
  onImageUpload: (imageDataUrl: string) => void;
  imageUrl?: string;
}

function ImageInput({ onImageUpload, imageUrl }: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageInputFile, setImageInputFile] = useState<string | null>(null);
  const [fileTypeError, setFileTypeError] = useState<boolean>(false);

  useEffect(() => {
    if (imageUrl) {
      setImageInputFile(imageUrl);
    }
  }, [imageUrl]);

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      if (
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg'
      ) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            const imageUrl = event.target.result as string;
            setImageInputFile(imageUrl);
            onImageUpload(imageUrl);
          }
        };

        reader.readAsDataURL(file);
        setFileTypeError(false);
      } else {
        setImageInputFile(null);
        setFileTypeError(true);
      }
    }
  };

  return (
    <div className={styles.containerImageInput}>
      {imageInputFile ? (
        <img
          src={imageInputFile}
          onClick={openFileSelector}
          alt="Image"
          className={styles.imgImageInput}
        />
      ) : !fileTypeError ? (
        <div className="d-flex flex-column">
          <div onClick={openFileSelector} className={styles.titleImageInput}>
            Selecione a foto do prato
          </div>
          <div onClick={openFileSelector} className={styles.subtitleImageInput}>
            Apenas arquivos de imagem são permitidos (JPG, JPEG, PNG)
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column">
          <div
            onClick={openFileSelector}
            className={styles.titleImageInputError}
          >
            Tipo de arquivo inválido
          </div>
          <div onClick={openFileSelector} className={styles.subtitleImageInput}>
            Apenas arquivos de imagem são permitidos (JPG, JPEG, PNG)
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".png, .jpg, .jpeg"
      />
    </div>
  );
}

export default ImageInput;
