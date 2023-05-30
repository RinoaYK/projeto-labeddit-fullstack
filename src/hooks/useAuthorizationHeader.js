import { useEffect } from 'react';
import Cookies from 'js-cookie';

export let headers = {};

export const setAuthorizationHeader = () => {
  const token = Cookies.get('token');
  headers = {
    headers: {
      Authorization: token,
    },
  };
};

export const useAuthorizationHeader = () => {
  useEffect(() => {
    setAuthorizationHeader();
  }, []);
};
