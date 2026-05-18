const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

class AuthService {

  constructor() {
    this.TOKEN_KEY =
      'access_token';

    this.USER_KEY =
      'user_data';
  }

  /**
   * Register user
   */
  async register(
    username,
    email,
    password
  ) {

    const response =
      await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            username,
            email,
            password
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Registration failed'
      );
    }

    this.setToken(
      data.access_token
    );

    this.setUser(
      data.user
    );

    window.dispatchEvent(
      new CustomEvent(
        'auth-change'
      )
    );

    return data;
  }

  /**
   * Login user
   */
  async login(
    email,
    password
  ) {

    const response =
      await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Login failed'
      );
    }

    this.setToken(
      data.access_token
    );

    this.setUser(
      data.user
    );

    window.dispatchEvent(
      new CustomEvent(
        'auth-change'
      )
    );

    return data;
  }

  /**
   * Logout
   */
  logout() {

    localStorage.removeItem(
      this.TOKEN_KEY
    );

    localStorage.removeItem(
      this.USER_KEY
    );

    window.dispatchEvent(
      new CustomEvent(
        'auth-change'
      )
    );
  }

  logoutAndRedirect() {
    this.logout();
    window.location.href =
      '/';
  }

  /**
   * Current user
   */
  getCurrentUser() {

    const userStr =
      localStorage.getItem(
        this.USER_KEY
      );

    return userStr
      ? JSON.parse(userStr)
      : null;
  }

  /**
   * Token
   */
  getToken() {

    return localStorage.getItem(
      this.TOKEN_KEY
    );
  }

  setToken(token) {

    localStorage.setItem(
      this.TOKEN_KEY,
      token
    );
  }

  setUser(user) {

    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify(user)
    );
  }

  /**
   * Auth check
   */
  isAuthenticated() {

    return !!this.getToken();
  }

  /**
   * Auth headers
   */
  getAuthHeaders() {

    const token =
      this.getToken();

    console.log(
      'JWT Token:',
      token
    );

    return {
      'Content-Type':
        'application/json',

      Authorization:
        `Bearer ${token}`
    };
  }
}

export default new AuthService();