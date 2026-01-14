const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/transports - Получить все транспорты
router.get("/", async (req, res) => {
  try {
    const transports = await prisma.transport.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        photos: true,
      },
    });

    const formattedTransports = transports.map((transport) => ({
      key: transport.id.toString(),
      id: transport.id,
      name: transport.name,
      type: transport.type === "intercity" ? "Межгород" : "Городской",
      description: transport.description || "",
      photos: transport.photos.map((photo) => photo.url),
      status: transport.status === "active" ? "Активный" : "Неактивный",
      createdAt: transport.createdAt,
      updatedAt: transport.updatedAt,
    }));

    res.json({ data: formattedTransports, total: transports.length });
  } catch (error) {
    console.error("Error fetching transports:", error);
    res.status(500).json({
      message: "Ошибка при получении транспорта",
      error: error.message,
    });
  }
});

// GET /api/transports/:id - Получить транспорт по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transport = await prisma.transport.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        photos: true,
      },
    });

    if (!transport) {
      return res.status(404).json({ message: "Транспорт не найден" });
    }

    res.json({
      data: {
        ...transport,
        type: transport.type === "intercity" ? "Межгород" : "Городской",
        photos: transport.photos.map((photo) => photo.url),
      },
    });
  } catch (error) {
    console.error("Error fetching transport:", error);
    res.status(500).json({
      message: "Ошибка при получении транспорта",
      error: error.message,
    });
  }
});

// POST /api/transports - Создать транспорт
router.post("/", async (req, res) => {
  try {
    const { name, type, description, photos, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Наименование обязательно" });
    }

    const photoUrls = Array.isArray(photos) ? photos : [];

    const transport = await prisma.transport.create({
      data: {
        name,
        type:
          type === "intercity" || type === "Межгород" ? "intercity" : "city",
        description: description || null,
        status: status ? "active" : "inactive",
        photos: photoUrls.length
          ? {
              createMany: {
                data: photoUrls.map((url) => ({ url })),
              },
            }
          : undefined,
      },
      include: {
        photos: true,
      },
    });

    res.status(201).json({
      data: {
        ...transport,
        photos: transport.photos.map((photo) => photo.url),
      },
      message: "Транспорт успешно создан",
    });
  } catch (error) {
    console.error("Error creating transport:", error);
    res.status(500).json({
      message: "Ошибка при создании транспорта",
      error: error.message,
    });
  }
});

// PUT /api/transports/:id - Обновить транспорт
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, photos, status } = req.body;

    const photoUrls = Array.isArray(photos) ? photos : [];

    const transport = await prisma.transport.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        type:
          type === "intercity" || type === "Межгород" ? "intercity" : "city",
        description: description || null,
        status: status ? "active" : "inactive",
        photos: {
          deleteMany: {},
          ...(photoUrls.length
            ? {
                createMany: {
                  data: photoUrls.map((url) => ({ url })),
                },
              }
            : {}),
        },
      },
      include: {
        photos: true,
      },
    });

    res.json({
      data: {
        ...transport,
        photos: transport.photos.map((photo) => photo.url),
      },
      message: "Транспорт успешно обновлен",
    });
  } catch (error) {
    console.error("Error updating transport:", error);
    res.status(500).json({
      message: "Ошибка при обновлении транспорта",
      error: error.message,
    });
  }
});

// DELETE /api/transports/:id - Удалить транспорт
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.transport.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Транспорт успешно удален" });
  } catch (error) {
    console.error("Error deleting transport:", error);
    res.status(500).json({
      message: "Ошибка при удалении транспорта",
      error: error.message,
    });
  }
});

module.exports = router;
