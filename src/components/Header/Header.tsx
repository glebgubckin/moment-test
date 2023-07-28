import { FC, MouseEvent } from 'react';
import yandex from '../../assets/yandex.svg';
import styles from './header.module.scss';

const Header: FC<{ auth: boolean }> = ({ auth }) => {
  const login = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${
      import.meta.env.VITE_CLIENT_ID
    }`;
  };

  return (
    <header className={styles.header}>
      <h1>Загрузка файлов на Яндекс Диск</h1>
      {!auth ? (
        <>
          <p>Для загрузки файлов необходимо войти через Яндекс</p>
          <button className={styles.yandexBtn} onClick={(e) => login(e)}>
            <img src={yandex} alt="Войти с помощью Яндекс" />
          </button>
        </>
      ) : null}
    </header>
  );
};

export default Header;
