const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/food - Получить все виды питания
router.get("/", async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const formattedFoods = foods.map((food) => ({
      key: food.id.toString(),
      id: food.id,
      name: food.name,
      status: food.status === "active" ? "Активный" : "Неактивный",
      createdAt: food.createdAt,
      updatedAt: food.updatedAt,
    }));

    res.json({ data: formattedFoods, total: foods.length });
  } catch (error) {
    console.error("Error fetching food:", error);
    res.status(500).json({
      message: "Ошибка при получении питания",
      error: error.message,
    });
  }
});

// GET /api/food/:id - Получить питание по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const food = await prisma.food.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!food) {
      return res.status(404).json({ message: "Питание не найдено" });
    }

    res.json({ data: food });
  } catch (error) {
    console.error("Error fetching food:", error);
    res.status(500).json({
      message: "Ошибка при получении питания",
      error: error.message,
    });
  }
});

// POST /api/food - Создать питание
router.post("/", async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Наименование обязательно" });
    }

    const food = await prisma.food.create({
      data: {
        name,
        status: status ? "active" : "inactive",
      },
    });

    res.status(201).json({
      data: food,
      message: "Питание успешно создано",
    });
  } catch (error) {
    console.error("Error creating food:", error);
    res.status(500).json({
      message: "Ошибка при создании питания",
      error: error.message,
    });
  }
});

// PUT /api/food/:id - Обновить питание
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const food = await prisma.food.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        status: status ? "active" : "inactive",
      },
    });

    res.json({
      data: food,
      message: "Питание успешно обновлено",
    });
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({
      message: "Ошибка при обновлении питания",
      error: error.message,
    });
  }
});

// DELETE /api/food/:id - Удалить питание
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.food.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Питание успешно удалено" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({
      message: "Ошибка при удалении питания",
      error: error.message,
    });
  }
});

module.exports = router;
