import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="welcome-page">
      <h1>Добро пожаловать в MyCloud</h1>
      <div className="auth-options">
        <Link to="/login" className="btn primary">
          Войти
        </Link>
        <Link to="/register" className="btn secondary">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;