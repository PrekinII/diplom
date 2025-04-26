import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaEdit, FaCheck, FaTimes, FaDownload, FaTrash, FaLink, FaSignOutAlt } from 'react-icons/fa';
import { FaPencil } from "react-icons/fa6";

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

function FileManagerPage() {
  // Состояние пользователя
  const [user, setUser] = useState(null);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editNameId, setEditNameId] = useState(null);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Получение CSRF-токена
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

  // Получение списка файлов
  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/storage/', {
        withCredentials: true
      });
      setFiles(res.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Ошибка загрузки списка файлов');
      if (error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка файла
  const uploadFile = async () => {
    if (!selectedFile) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('comment', comment);

    try {
      await axios.post('/api/storage/upload/', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchFiles();
      setSelectedFile(null);
      setComment('');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Ошибка загрузки файла');
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление файла
  const deleteFile = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот файл?')) return;

    setIsLoading(true);
    try {
      await axios.delete(`/api/storage/${id}/delete/`, {
        withCredentials: true
      });
      await fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      setError('Ошибка удаления файла');
    } finally {
      setIsLoading(false);
    }
  };

  // Переименование файла
  const renameFile = async (id, currentName) => {

    setIsLoading(true);
    try {
      await axios.patch(
        `/api/storage/${id}/edit/`,
        { original_name: newName },
        { withCredentials: true }
      );

      await fetchFiles();
      setEditNameId(null);

    } catch (error) {
      console.error('Rename error:', error);
      setError('Ошибка переименования файла');
    } finally {
      setIsLoading(false);
    }
  };

  // Изменение комментария
  const updateComment = async (id) => {
    setIsLoading(true);
    try {
      await axios.patch(
        `/api/storage/${id}/edit/`,
        { comment: newComment },
        { withCredentials: true }
      );
      setEditCommentId(null);
      setNewComment('');
      await fetchFiles();
    } catch (error) {
      console.error('Comment update error:', error);
      setError('Ошибка обновления комментария');
    } finally {
      setIsLoading(false);
    }
  };

  // Скачивание файла
  const downloadFile = (id) => {
  // Формируем ПОЛНЫЙ URL к эндпоинту скачивания на бэкенде
    const downloadUrl = `${API_BASE_URL}/api/storage/${id}/download/`;
    window.open(downloadUrl, '_blank');
  };

  // Генерация публичной ссылки
  const generatePublicLink = async (id) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/storage/${id}/generate_link/`,
        {},
        { withCredentials: true }
      );
      const publicUrl = `${API_BASE_URL}/api/storage/public/${res.data.public_link}/`;
      await navigator.clipboard.writeText(publicUrl);
      alert(`Публичная ссылка скопирована:\n${publicUrl}\n\nЕё можно отправить другим пользователям.`);
    } catch (error) {
      console.error('Link generation error:', error);
      setError('Ошибка генерации ссылки');
    }
  };
  // Функция получения данных пользователя
  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/users/me/', {
        withCredentials: true
      });
      setUser(res.data);
    } catch (error) {
      navigate('/login');
    }
  };

  // Функция выхода
  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout/', {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Инициализация
  useEffect(() => {
    fetchUser(); // !!! Загружаем данные пользователя
    getCsrfToken();
    fetchFiles();
  }, []);

  return (
    <div className="file-manager">
      <div className="user-header">
        {user && (
          <>
            <span>Пользователь: <strong>{user.username}</strong></span>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Выйти
            </button>
          </>
        )}
      </div>

      <h2>Управление файлами</h2>

      {error && <div className="error">{error}</div>}
      {isLoading && <div className="loading">Загрузка...</div>}

      {/* Форма загрузки файла */}
      <div className="upload-section">
        <h3>Загрузить новый файл</h3>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Комментарий к файлу"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={uploadFile}
          disabled={isLoading || !selectedFile}
        >
          <FaUpload />
          {isLoading ? 'Загрузка...' : ' Загрузить'}

        </button>
      </div>

      {/* Список файлов */}
      <div className="file-list">
        <h3>Ваши файлы</h3>
        {files.length === 0 && !isLoading ? (
          <p>У вас пока нет файлов</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Имя файла</th>
                <th>Размер</th>
                <th>Дата загрузки</th>
                <th>Комментарий</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>
                    {editNameId === file.id ? (
                      <div className="edit-container">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && renameFile(file.id, file.original_name)}
                        />
                        <div className="edit-actions">
                          <button
                            onClick={() => renameFile(file.id, file.original_name)}
                            disabled={isLoading}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => setEditNameId(null)}
                            disabled={isLoading}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="file-name">
                        <span>{file.original_name}</span>
                        <button
                          onClick={() => {
                            setEditNameId(file.id);
                            setNewName(file.original_name);
                          }}
                          disabled={isLoading}
                        >
                          <FaPencil />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>{(file.size)} KB</td>
                  <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                  <td>
                    {editCommentId === file.id ? (
                      <div className="edit-container">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && updateComment(file.id)}
                        />
                        <div className="edit-actions">
                          <button
                            onClick={() => updateComment(file.id)}
                            disabled={isLoading}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => setEditCommentId(null)}
                            disabled={isLoading}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="file-comment">
                        <span>{file.comment || 'нет комментария'}</span>
                        <button
                          onClick={() => {
                            setEditCommentId(file.id);
                            setNewComment(file.comment || '');
                          }}
                          disabled={isLoading}
                        >
                          <FaPencil />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => downloadFile(file.id)}
                      disabled={isLoading}
                    >
                      <FaDownload /> Скачать
                    </button>
                    <button
                      onClick={() => deleteFile(file.id)}
                      disabled={isLoading}
                    >
                      <FaTrash /> Удалить
                    </button>
                    <button
                      onClick={() => generatePublicLink(file.id)}
                      disabled={isLoading}
                    >
                      <FaLink /> Получить ссылку
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FileManagerPage;