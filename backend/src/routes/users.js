const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users/roles/list - Получить все роли (должен быть выше /:id)
router.get('/roles/list', async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ data: roles, total: roles.length });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Ошибка при получении ролей', error: error.message });
  }
});

// GET /api/users/companies/list - Получить все компании (должен быть выше /:id)
router.get('/companies/list', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ data: companies, total: companies.length });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Ошибка при получении компаний', error: error.message });
  }
});

// GET /api/users - Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        company: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedUsers = users.map(user => ({
      key: user.id.toString(),
      id: user.id,
      fullName: user.fullName,
      account: user.account,
      company: user.company?.name || '-',
      companyId: user.companyId,
      role: user.role?.name || '-',
      roleId: user.roleId,
      status: user.status === 'active' ? 'Активный' : 'Неактивный',
      isSuperAdmin: user.isSuperAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.json({ data: formattedUsers, total: users.length });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Ошибка при получении пользователей', error: error.message });
  }
});

// GET /api/users/:id - Получить пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Ошибка при получении пользователя', error: error.message });
  }
});

// POST /api/users - Создать пользователя
router.post('/', async (req, res) => {
  try {
    const { fullName, account, password, status, companyId, roleId } = req.body;

    if (!fullName || !account) {
      return res.status(400).json({ message: 'ФИО и аккаунт обязательны' });
    }

    // Проверяем, существует ли пользователь с таким аккаунтом
    const existingUser = await prisma.user.findUnique({
      where: { account },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким аккаунтом уже существует' });
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        account,
        password: password || '123456', // Временный пароль
        status: status ? 'active' : 'inactive',
        companyId: companyId ? parseInt(companyId) : null,
        roleId: roleId ? parseInt(roleId) : null,
      },
      include: {
        company: true,
        role: true,
      },
    });

    res.status(201).json({ 
      data: user,
      message: 'Пользователь успешно создан' 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Ошибка при создании пользователя', error: error.message });
  }
});

// PUT /api/users/:id - Обновить пользователя
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, account, status, companyId, roleId } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        fullName,
        account,
        status: status ? 'active' : 'inactive',
        companyId: companyId ? parseInt(companyId) : null,
        roleId: roleId ? parseInt(roleId) : null,
      },
      include: {
        company: true,
        role: true,
      },
    });

    res.json({ 
      data: user,
      message: 'Пользователь успешно обновлен' 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Ошибка при обновлении пользователя', error: error.message });
  }
});

// DELETE /api/users/:id - Удалить пользователя
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Ошибка при удалении пользователя', error: error.message });
  }
});

module.exports = router;
