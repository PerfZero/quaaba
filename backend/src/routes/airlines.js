const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/airlines - Получить все авиакомпании
router.get("/", async (req, res) => {
  try {
    const airlines = await prisma.airline.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const formattedAirlines = airlines.map((airline) => ({
      key: airline.id.toString(),
      id: airline.id,
      name: airline.name,
      description: airline.description || "",
      status: airline.status === "active" ? "Активный" : "Неактивный",
      createdAt: airline.createdAt,
      updatedAt: airline.updatedAt,
    }));

    res.json({ data: formattedAirlines, total: airlines.length });
  } catch (error) {
    console.error("Error fetching airlines:", error);
    res.status(500).json({
      message: "Ошибка при получении авиакомпаний",
      error: error.message,
    });
  }
});

// GET /api/airlines/:id - Получить авиакомпанию по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const airline = await prisma.airline.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!airline) {
      return res.status(404).json({ message: "Авиакомпания не найдена" });
    }

    res.json({ data: airline });
  } catch (error) {
    console.error("Error fetching airline:", error);
    res.status(500).json({
      message: "Ошибка при получении авиакомпании",
      error: error.message,
    });
  }
});

// POST /api/airlines - Создать авиакомпанию
router.post("/", async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Наименование обязательно" });
    }

    const airline = await prisma.airline.create({
      data: {
        name,
        description: description || null,
        status: status ? "active" : "inactive",
      },
    });

    res.status(201).json({
      data: airline,
      message: "Авиакомпания успешно создана",
    });
  } catch (error) {
    console.error("Error creating airline:", error);
    res.status(500).json({
      message: "Ошибка при создании авиакомпании",
      error: error.message,
    });
  }
});

// PUT /api/airlines/:id - Обновить авиакомпанию
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const airline = await prisma.airline.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        description: description || null,
        status: status ? "active" : "inactive",
      },
    });

    res.json({
      data: airline,
      message: "Авиакомпания успешно обновлена",
    });
  } catch (error) {
    console.error("Error updating airline:", error);
    res.status(500).json({
      message: "Ошибка при обновлении авиакомпании",
      error: error.message,
    });
  }
});

// DELETE /api/airlines/:id - Удалить авиакомпанию
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.airline.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Авиакомпания успешно удалена" });
  } catch (error) {
    console.error("Error deleting airline:", error);
    res.status(500).json({
      message: "Ошибка при удалении авиакомпании",
      error: error.message,
    });
  }
});

module.exports = router;
