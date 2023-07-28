import { ChangeEvent, FC, MouseEvent, useRef, useState } from 'react';
import styles from './uploader.module.scss';
import axios from 'axios';

interface FileNode {
  id: number;
  file: File;
}
const maxFiles = 100;

const Uploader: FC = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState<
    null | 'pending' | 'completed' | 'error'
  >(null);
  const inputFile = useRef<HTMLInputElement>(null);

  const filesHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (inputFile.current && files.length < maxFiles) {
      inputFile.current.click();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesList = Array.from(e.target.files)
        .slice(0, maxFiles - files.length)
        .map((file, id) => ({ id, file }));
      setFiles((prev) => prev.concat(filesList));
    }
  };

  const deleteFileHandler = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const uploadHandler = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading('pending');
    for (const file of files) {
      const uploadUrl = await (
        await axios.get(
          `https://cloud-api.yandex.net/v1/disk/resources/upload?path=%2F${file.file.name}`,
          {
            headers: {
              Authorization: `OAuth ${localStorage.getItem('token')}`,
            },
          }
        )
      ).data;
      try {
        await axios.put(uploadUrl.href, file.file, {
          headers: {
            'Content-Type': file.file.type,
          },
        });
      } catch (e: any) {
        setLoading('error');
      }
    }
    setLoading((prev) => (prev !== 'error' ? 'completed' : 'error'));
    setFiles([]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.uploader} onClick={(e) => filesHandler(e)}>
        {files.map((file) => (
          <div key={file.id} className={styles.file}>
            <span className={styles.file__title}>{file.file.name}</span>
            <button
              className={styles.delete}
              onClick={(e) => deleteFileHandler(e, file.id)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        id="file"
        multiple
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      {loading === 'pending' && <p>Идёт загрузка</p>}
      {loading === 'completed' && <p>Загрузка завершена</p>}
      {loading === 'error' && <p>Произошла ошибка! Попробуйте позже</p>}
      <button
        onClick={(e) => uploadHandler(e)}
        disabled={!files.length}
        className={styles.btn}
      >
        Загрузить
      </button>
    </div>
  );
};

export default Uploader;
