const express = require('express');
const router = express.Router();

// Тестовые пользователи
const TEST_USERS = {
  admin: {
    id: 1,
    email: 'admin@qaaba.com',
    password: '123456',
    name: 'Администратор',
    role: 'admin',
    onboarded: true
  },
  agent: {
    id: 2,
    email: 'agent@qaaba.com',
    password: '123456',
    name: 'Агент',
    role: 'agent',
    onboarded: true
  }
};

// Временное хранилище для регистраций
const pendingRegistrations = new Map();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  // Поиск пользователя по email
  const user = Object.values(TEST_USERS).find(u => u.email === email && u.password === password);
  
  if (user) {
    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token: 'test-token-' + Date.now()
    });
  }

  return res.status(401).json({ message: 'Неверный email или пароль' });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  // Валидация пароля
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isValidPassword = Object.values(passwordValidation).every(Boolean);
  
  if (!isValidPassword) {
    return res.status(400).json({ 
      message: 'Пароль не соответствует требованиям',
      validation: passwordValidation
    });
  }

  // Проверка существования пользователя
  const existingUser = Object.values(TEST_USERS).find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
  }

  // Генерация кода подтверждения (в реальном приложении отправляется на email)
  const confirmationCode = process.env.NODE_ENV === 'production' 
    ? Math.floor(100000 + Math.random() * 900000).toString()
    : '123456'; // Тестовый код для разработки
  
  // Сохранение временной регистрации
  pendingRegistrations.set(email, {
    email,
    password,
    confirmationCode,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 минут
  });

  console.log(`Код подтверждения для ${email}: ${confirmationCode}`);

  return res.json({
    success: true,
    message: 'Код подтверждения отправлен на email',
    email
  });
});

// POST /api/auth/confirm
router.post('/confirm', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email и код обязательны' });
  }

  const registration = pendingRegistrations.get(email);
  
  if (!registration) {
    return res.status(400).json({ message: 'Регистрация не найдена или истекла' });
  }

  if (Date.now() > registration.expiresAt) {
    pendingRegistrations.delete(email);
    return res.status(400).json({ message: 'Срок регистрации истек' });
  }

  if (registration.confirmationCode !== code) {
    return res.status(400).json({ message: 'Неверный код подтверждения' });
  }

  // Создание нового пользователя (агента)
  const newUserId = Math.max(...Object.values(TEST_USERS).map(u => u.id)) + 1;
  const newUser = {
    id: newUserId,
    email: registration.email,
    password: registration.password,
    name: 'Агент',
    role: 'agent',
    onboarded: false // Новые пользователи должны пройти онбординг
  };

  // В реальном приложении здесь сохранение в базу данных
  TEST_USERS[newUserId] = newUser;
  
  // Удаление временной регистрации
  pendingRegistrations.delete(email);

  return res.json({
    success: true,
    message: 'Регистрация успешно завершена',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      onboarded: newUser.onboarded
    },
    token: 'test-token-' + Date.now()
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('test-token-')) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  // Возвращаем админа по умолчанию для /me эндпоинта
  const adminUser = TEST_USERS.admin;
  return res.json({
    user: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role
    }
  });
});

module.exports = router;

