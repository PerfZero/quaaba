const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/cities - Получить все города
router.get('/', async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const formattedCities = cities.map((city) => ({
      key: city.id.toString(),
      id: city.id,
      name: city.name,
      short: city.short,
      status: city.status === 'active' ? 'Активный' : 'Неактивный',
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
    }));

    res.json({ data: formattedCities, total: cities.length });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Ошибка при получении городов', error: error.message });
  }
});

// GET /api/cities/:id - Получить город по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({
      where: { id: parseInt(id) },
    });

    if (!city) {
      return res.status(404).json({ message: 'Город не найден' });
    }

    res.json({ data: city });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ message: 'Ошибка при получении города', error: error.message });
  }
});

// POST /api/cities - Создать город
router.post('/', async (req, res) => {
  try {
    const { name, short, status } = req.body;

    if (!name || !short) {
      return res.status(400).json({ message: 'Наименование и краткое обязательны' });
    }

    // Проверяем, существует ли город с таким сокращением
    const existingCity = await prisma.city.findUnique({
      where: { short },
    });

    if (existingCity) {
      return res.status(400).json({ message: 'Город с таким сокращением уже существует' });
    }

    const city = await prisma.city.create({
      data: {
        name,
        short,
        status: status ? 'active' : 'inactive',
      },
    });

    res.status(201).json({
      data: city,
      message: 'Город успешно создан'
    });
  } catch (error) {
    console.error('Error creating city:', error);
    res.status(500).json({ message: 'Ошибка при создании города', error: error.message });
  }
});

// PUT /api/cities/:id - Обновить город
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, short, status } = req.body;

    // Проверяем, существует ли другой город с таким сокращением
    if (short) {
      const existingCity = await prisma.city.findUnique({
        where: { short },
      });

      if (existingCity && existingCity.id !== parseInt(id)) {
        return res.status(400).json({ message: 'Город с таким сокращением уже существует' });
      }
    }

    const city = await prisma.city.update({
      where: { id: parseInt(id) },
      data: {
        name,
        short,
        status: status ? 'active' : 'inactive',
      },
    });

    res.json({
      data: city,
      message: 'Город успешно обновлен'
    });
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ message: 'Ошибка при обновлении города', error: error.message });
  }
});

// DELETE /api/cities/:id - Удалить город
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.city.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Город успешно удален' });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ message: 'Ошибка при удалении города', error: error.message });
  }
});

module.exports = router;
