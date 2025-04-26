import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users/all/');
      setUsers(res.data);
    } catch (error) {
      alert("Ошибка доступа или загрузки");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}/delete/`);
      fetchUsers();
    } catch {
      alert("Ошибка удаления пользователя");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Панель администратора</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.username} ({u.email}) - {u.is_staff ? "Админ" : "Пользователь"}
            <button onClick={() => deleteUser(u.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;