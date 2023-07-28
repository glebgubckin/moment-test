import { FC, useEffect, useState } from 'react';
import Uploader from './components/Uploader/Uploader';
import Header from './components/Header/Header';
import styles from './app.module.scss';
import { getToken } from './utils';

const App: FC = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const code: string | undefined = window.location.search.split('=')[1];
    const token = localStorage.getItem('token');
    if (!token && code) {
      const token = getToken(code);
      token.then((data) => {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/';
      });
    } else if (token) {
      setAuth(true);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <Header auth={auth} />
        <Uploader />
      </div>
    </div>
  );
};

export default App;
