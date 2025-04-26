import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: ''
  });
  const [errors, setErrors] = useState({
    username: [],
    email: [],
    password: [],
    non_field: []
  });
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const navigate = useNavigate();

  const getCsrfToken = async () => {
    try {
      const response = await axios.get('/api/csrf/', {
        withCredentials: true
      });
      axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
    } catch (error) {
      console.error('CSRF token error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]?.length > 0) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const register = async () => {
    try {
      setIsLoading(true);
      setErrors({
        username: [],
        email: [],
        password: [],
        non_field: []
      });

      await getCsrfToken();

      const response = await axios.post('/api/users/register/', form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': axios.defaults.headers.common['X-CSRFToken']
        }
      });

      if (response.status === 201) {
        alert("Регистрация успешна");
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error.response);

      if (error.response?.data) {
        setErrors({
          username: error.response.data.username || [],
          email: error.response.data.email || [],
          password: error.response.data.password || [],
          non_field: error.response.data.non_field_errors || []
        });
      } else {
        setErrors(prev => ({
          ...prev,
          non_field: ["Ошибка соединения с сервером"]
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Регистрация</h2>

      {errors.non_field.length > 0 && (
        <div className="error-message">
          {errors.non_field.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <div className="form-group">
        <input
          name="username"
          placeholder="Логин"
          value={form.username}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.username.length > 0 && (
          <div className="error-message">
            {errors.username.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <input
          name="first_name"
          placeholder="Имя"
          value={form.first_name}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.email.length > 0 && (
          <div className="error-message">
            {errors.email.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.password.length > 0 && (
          <div className="error-message">
            {errors.password.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={register}
        disabled={isLoading || !form.username || !form.email || !form.password}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>

      {/* !!! Добавлен блок перехода на страницу входа */}
      <div className="auth-switch">
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </div>
    </div>
  );
}

export default RegisterPage;