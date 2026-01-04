const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/banks - Получить все банки
router.get('/', async (req, res) => {
  try {
    const banks = await prisma.bank.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const formattedBanks = banks.map(bank => ({
      key: bank.id.toString(),
      id: bank.id,
      name: bank.name,
      bic: bank.bic,
      status: bank.status === 'active' ? 'Активный' : 'Неактивный',
      createdAt: bank.createdAt,
      updatedAt: bank.updatedAt,
    }));

    res.json({ data: formattedBanks, total: banks.length });
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ message: 'Ошибка при получении банков', error: error.message });
  }
});

// GET /api/banks/:id - Получить банк по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await prisma.bank.findUnique({
      where: { id: parseInt(id) },
    });

    if (!bank) {
      return res.status(404).json({ message: 'Банк не найден' });
    }

    res.json({ data: bank });
  } catch (error) {
    console.error('Error fetching bank:', error);
    res.status(500).json({ message: 'Ошибка при получении банка', error: error.message });
  }
});

// POST /api/banks - Создать банк
router.post('/', async (req, res) => {
  try {
    const { name, bic, status } = req.body;

    if (!name || !bic) {
      return res.status(400).json({ message: 'Наименование и БИК обязательны' });
    }

    // Проверяем, существует ли банк с таким БИК
    const existingBank = await prisma.bank.findUnique({
      where: { bic },
    });

    if (existingBank) {
      return res.status(400).json({ message: 'Банк с таким БИК уже существует' });
    }

    const bank = await prisma.bank.create({
      data: {
        name,
        bic,
        status: status ? 'active' : 'inactive',
      },
    });

    res.status(201).json({ 
      data: bank,
      message: 'Банк успешно создан' 
    });
  } catch (error) {
    console.error('Error creating bank:', error);
    res.status(500).json({ message: 'Ошибка при создании банка', error: error.message });
  }
});

// PUT /api/banks/:id - Обновить банк
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bic, status } = req.body;

    // Проверяем, существует ли другой банк с таким БИК
    if (bic) {
      const existingBank = await prisma.bank.findUnique({
        where: { bic },
      });

      if (existingBank && existingBank.id !== parseInt(id)) {
        return res.status(400).json({ message: 'Банк с таким БИК уже существует' });
      }
    }

    const bank = await prisma.bank.update({
      where: { id: parseInt(id) },
      data: {
        name,
        bic,
        status: status ? 'active' : 'inactive',
      },
    });

    res.json({ 
      data: bank,
      message: 'Банк успешно обновлен' 
    });
  } catch (error) {
    console.error('Error updating bank:', error);
    res.status(500).json({ message: 'Ошибка при обновлении банка', error: error.message });
  }
});

// DELETE /api/banks/:id - Удалить банк
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.bank.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Банк успешно удален' });
  } catch (error) {
    console.error('Error deleting bank:', error);
    res.status(500).json({ message: 'Ошибка при удалении банка', error: error.message });
  }
});

module.exports = router;

