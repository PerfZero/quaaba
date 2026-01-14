const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/rooms - Получить все комнаты
router.get("/", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const formattedRooms = rooms.map((room) => ({
      key: room.id.toString(),
      id: room.id,
      name: room.name,
      status: room.status === "active" ? "Активный" : "Неактивный",
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    }));

    res.json({ data: formattedRooms, total: rooms.length });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      message: "Ошибка при получении комнат",
      error: error.message,
    });
  }
});

// GET /api/rooms/:id - Получить комнату по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!room) {
      return res.status(404).json({ message: "Комната не найдена" });
    }

    res.json({ data: room });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      message: "Ошибка при получении комнаты",
      error: error.message,
    });
  }
});

// POST /api/rooms - Создать комнату
router.post("/", async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Наименование обязательно" });
    }

    const room = await prisma.room.create({
      data: {
        name,
        status: status ? "active" : "inactive",
      },
    });

    res.status(201).json({
      data: room,
      message: "Комната успешно создана",
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      message: "Ошибка при создании комнаты",
      error: error.message,
    });
  }
});

// PUT /api/rooms/:id - Обновить комнату
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const room = await prisma.room.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        status: status ? "active" : "inactive",
      },
    });

    res.json({
      data: room,
      message: "Комната успешно обновлена",
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({
      message: "Ошибка при обновлении комнаты",
      error: error.message,
    });
  }
});

// DELETE /api/rooms/:id - Удалить комнату
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.room.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Комната успешно удалена" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      message: "Ошибка при удалении комнаты",
      error: error.message,
    });
  }
});

module.exports = router;
