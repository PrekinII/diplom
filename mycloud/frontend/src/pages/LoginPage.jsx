import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = "http://95.163.223.166/api";
console.log("API_BASE_URL:", API_BASE_URL);

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const navigate = useNavigate();

  const login = async () => {
    setIsLoading(true);
    try {
      // Получение CSRF-токена
      const csrfResponse = await axios.get(`${API_BASE_URL}/api/csrf/`, {
        withCredentials: true
      });
      axios.defaults.headers.common['X-CSRFToken'] = csrfResponse.data.csrfToken;

      // Авторизация
      const response = await axios.post(`${API_BASE_URL}/api/users/login/`,
        { username, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard'); // !!! Изменен путь на /dashboard
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || "Ошибка входа. Проверьте данные и попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Вход в систему</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={login}
        disabled={isLoading || !username || !password}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
      <div className="auth-switch">
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
      </div>
    </div>
  );
}

export default LoginPage;
