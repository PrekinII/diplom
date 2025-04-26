import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Cостояние загрузки
  const navigate = useNavigate();

  // Получение CSRF-токена (аналогично FileManagerPage)
  const getCsrfToken = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/csrf/`, {
        withCredentials: true
      });
      axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
    } catch (error) {
      console.error('CSRF token error:', error);
    }
  };

  // Получение данных пользователя (аналогично FileManagerPage)
  const fetchUser = async () => {
    setIsLoading(true); // Устанавливаем состояние загрузки перед запросом
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/me/`, {
        withCredentials: true
      });
      setUser(res.data);
    } catch (error) {
      setUser(null);
      if (error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false); // Снимаем состояние загрузки после завершения
    }
  };

  // Выход
  const handleLogout = async () => {
    try {
      // Убедимся, что CSRF-токен актуален
      await getCsrfToken();

      await axios.post(`${API_BASE_URL}/api/users/logout/`, {}, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': axios.defaults.headers.common['X-CSRFToken']
        }
      });
      setUser(null);
      navigate('/'); // Изменено с '/login' на '/' для перехода на WelcomePage
    } catch (error) {
      console.error('Logout error:', error);
      if (error.response?.status === 403) {
        alert('Сессия устарела. Пожалуйста, войдите снова.');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    getCsrfToken();
    fetchUser();
  }, []);

  // Проверка состояния загрузки
  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Добро пожаловать в MyCloud</h1>

      {user && (
        <div>
          <div className="user-info">
            Вы вошли как: <strong>{user.username}</strong>
            {user.is_staff && <span> (Администратор)</span>}
            <button onClick={handleLogout} className="logout-btn">
              Выйти
            </button>
          </div>
          <div className="dashboard-buttons">
            <Link to="/files" className="btn primary">
              Мое хранилище
            </Link>

            {user.is_staff && (
              <a href={`${API_BASE_URL}/admin/`} className="btn secondary">
               Панель администратора
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;