import jwtDecode from 'jwt-decode';

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

interface User {
  id: string;
  exp: number;
  iat: number;
}

export const getUserFromToken = (): User | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const user = jwtDecode<User>(token);
    return user;
  } catch (err) {
    return null;
  }
};
