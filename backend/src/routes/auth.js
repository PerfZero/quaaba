const express = require('express');
const router = express.Router();

// Тестовый пользовате
const TEST_USER = {
  id: 1,
  email: 'admin@qaaba.com',
  password: '123456',
  name: 'Администратор'
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  if (email === TEST_USER.email && password === TEST_USER.password) {
    return res.json({
      success: true,
      user: {
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name
      },
      token: 'test-token-' + Date.now()
    });
  }

  return res.status(401).json({ message: 'Неверный email или пароль' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('test-token-')) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  return res.json({
    user: {
      id: TEST_USER.id,
      email: TEST_USER.email,
      name: TEST_USER.name
    }
  });
});

module.exports = router;

