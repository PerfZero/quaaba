const express = require('express');
const router = express.Router();

// Пользователи
const users = [
  { id: 1, name: 'Администратор', email: 'admin@qaaba.com', role: 'admin', active: true },
  { id: 2, name: 'Менеджер', email: 'manager@qaaba.com', role: 'manager', active: true },
  { id: 3, name: 'Оператор', email: 'operator@qaaba.com', role: 'operator', active: true },
];

// Роли
const roles = [
  { id: 1, name: 'Администратор', code: 'admin', permissions: ['all'] },
  { id: 2, name: 'Менеджер', code: 'manager', permissions: ['read', 'write'] },
  { id: 3, name: 'Оператор', code: 'operator', permissions: ['read'] },
];

// Доступы
const access = [
  { id: 1, name: 'Полный доступ', code: 'all', description: 'Доступ ко всем разделам' },
  { id: 2, name: 'Чтение', code: 'read', description: 'Только просмотр' },
  { id: 3, name: 'Запись', code: 'write', description: 'Создание и редактирование' },
  { id: 4, name: 'Удаление', code: 'delete', description: 'Удаление записей' },
];

// GET /api/users
router.get('/', (req, res) => {
  res.json({ data: users, total: users.length });
});

// GET /api/users/roles
router.get('/roles', (req, res) => {
  res.json({ data: roles, total: roles.length });
});

// GET /api/users/access
router.get('/access', (req, res) => {
  res.json({ data: access, total: access.length });
});

module.exports = router;

