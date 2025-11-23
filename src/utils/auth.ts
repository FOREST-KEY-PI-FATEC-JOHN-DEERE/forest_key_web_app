export const authStorage = {
  setToken(token: string) {
    if (typeof window !== 'undefined') localStorage.setItem('token', token);
  },
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  clear() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
    }
  },
};

export default authStorage;
