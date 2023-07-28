import axios from 'axios';

export async function getToken(code: string) {
  return await (
    await axios.post(
      'https://oauth.yandex.ru/token',
      {
        grant_type: 'authorization_code',
        code,
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
  ).data;
}
