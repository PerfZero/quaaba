const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/extra-services - Получить все доп. услуги
router.get("/", async (req, res) => {
  try {
    const services = await prisma.extraService.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const formattedServices = services.map((service) => ({
      key: service.id.toString(),
      id: service.id,
      name: service.name,
      code: service.code,
      status: service.status === "active" ? "Активный" : "Неактивный",
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));

    res.json({ data: formattedServices, total: services.length });
  } catch (error) {
    console.error("Error fetching extra services:", error);
    res.status(500).json({
      message: "Ошибка при получении доп. услуг",
      error: error.message,
    });
  }
});

// GET /api/extra-services/:id - Получить доп. услугу по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.extraService.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!service) {
      return res.status(404).json({ message: "Доп. услуга не найдена" });
    }

    res.json({ data: service });
  } catch (error) {
    console.error("Error fetching extra service:", error);
    res.status(500).json({
      message: "Ошибка при получении доп. услуги",
      error: error.message,
    });
  }
});

// POST /api/extra-services - Создать доп. услугу
router.post("/", async (req, res) => {
  try {
    const { name, code, status } = req.body;

    if (!name || !code) {
      return res
        .status(400)
        .json({ message: "Наименование и код обязательны" });
    }

    const existingService = await prisma.extraService.findUnique({
      where: { code },
    });

    if (existingService) {
      return res.status(400).json({ message: "Код уже используется" });
    }

    const service = await prisma.extraService.create({
      data: {
        name,
        code,
        status: status ? "active" : "inactive",
      },
    });

    res.status(201).json({
      data: service,
      message: "Доп. услуга успешно создана",
    });
  } catch (error) {
    console.error("Error creating extra service:", error);
    res.status(500).json({
      message: "Ошибка при создании доп. услуги",
      error: error.message,
    });
  }
});

// PUT /api/extra-services/:id - Обновить доп. услугу
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, status } = req.body;

    if (code) {
      const existingService = await prisma.extraService.findUnique({
        where: { code },
      });

      if (existingService && existingService.id !== parseInt(id, 10)) {
        return res.status(400).json({ message: "Код уже используется" });
      }
    }

    const service = await prisma.extraService.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        code,
        status: status ? "active" : "inactive",
      },
    });

    res.json({
      data: service,
      message: "Доп. услуга успешно обновлена",
    });
  } catch (error) {
    console.error("Error updating extra service:", error);
    res.status(500).json({
      message: "Ошибка при обновлении доп. услуги",
      error: error.message,
    });
  }
});

// DELETE /api/extra-services/:id - Удалить доп. услугу
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.extraService.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Доп. услуга успешно удалена" });
  } catch (error) {
    console.error("Error deleting extra service:", error);
    res.status(500).json({
      message: "Ошибка при удалении доп. услуги",
      error: error.message,
    });
  }
});

module.exports = router;
