const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Создаем роли
  const adminRole = await prisma.role.upsert({
    where: { code: "superadmin" },
    update: {},
    create: {
      name: "Суперадмин",
      code: "superadmin",
      permissions: JSON.stringify(["all"]),
    },
  });

  const ownerRole = await prisma.role.upsert({
    where: { code: "owner" },
    update: {},
    create: {
      name: "Владелец",
      code: "owner",
      permissions: JSON.stringify(["read", "write", "delete"]),
    },
  });

  const adminRoleCompany = await prisma.role.upsert({
    where: { code: "admin" },
    update: {},
    create: {
      name: "Администратор",
      code: "admin",
      permissions: JSON.stringify(["read", "write"]),
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { code: "manager" },
    update: {},
    create: {
      name: "Менеджер продажи",
      code: "manager",
      permissions: JSON.stringify(["read", "write"]),
    },
  });

  const operatorRole = await prisma.role.upsert({
    where: { code: "operator" },
    update: {},
    create: {
      name: "Оператор",
      code: "operator",
      permissions: JSON.stringify(["read"]),
    },
  });

  console.log("Роли созданы:", {
    adminRole,
    ownerRole,
    adminRoleCompany,
    managerRole,
    operatorRole,
  });

  // Создаем тестовую компанию
  const company = await prisma.company.upsert({
    where: { inn: "930718300600" },
    update: {},
    create: {
      name: "ТОО ABBA",
      inn: "930718300600",
      form: "ТОО",
      address: "РК, г.Алматы, ул. Халиуллина",
      tariff: "Standard",
      tourCode: "VSJ123",
      status: "active",
    },
  });

  console.log("Компания создана:", company);

  // Создаем суперадмина
  const superAdmin = await prisma.user.upsert({
    where: { account: "admin@qaaba.com" },
    update: {},
    create: {
      fullName: "Суперадмин",
      account: "admin@qaaba.com",
      password: "123456", // В продакшене использовать хеширование!
      status: "active",
      isSuperAdmin: true,
      roleId: adminRole.id,
    },
  });

  console.log("Суперадмин создан:", superAdmin);

  // Создаем тестовых пользователей
  const users = [
    {
      fullName: "Омар Алишер",
      account: "alisher@example.com",
      password: "123456",
      status: "active",
      companyId: company.id,
      roleId: ownerRole.id,
    },
    {
      fullName: "Орынбек Дулат",
      account: "dulat@example.com",
      password: "123456",
      status: "active",
      companyId: company.id,
      roleId: managerRole.id,
    },
    {
      fullName: "Айжан Карабаева",
      account: "aijan@example.com",
      password: "123456",
      status: "active",
      companyId: company.id,
      roleId: adminRoleCompany.id,
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { account: userData.account },
      update: {},
      create: userData,
    });
    console.log("Пользователь создан:", user.fullName);
  }

  // Создаем банки
  const banks = [
    { name: 'АО "Kaspi Bank"', bic: "CASPKZKA", status: "active" },
    { name: 'АО "Halyk Bank"', bic: "HSBKKZKX", status: "active" },
    { name: 'АО "ForteBank"', bic: "IRTYKZKA", status: "active" },
    { name: 'АО "Bank CenterCredit"', bic: "KCJBKZKX", status: "active" },
    { name: 'АО "Jýsan Bank"', bic: "TSESKZKA", status: "active" },
    { name: 'АО "Eurasian Bank"', bic: "EURAKZKA", status: "active" },
    { name: 'АО "Altyn Bank"', bic: "ALMNKZKA", status: "inactive" },
    { name: 'АО "Home Credit Bank"', bic: "HOMRKZKA", status: "active" },
    { name: 'АО "Bank RBK"', bic: "RBKSKZKA", status: "active" },
    {
      name: 'АО "First Heartland Jýsan Bank"',
      bic: "FHBKKZKA",
      status: "active",
    },
  ];

  for (const bankData of banks) {
    const bank = await prisma.bank.upsert({
      where: { bic: bankData.bic },
      update: {},
      create: bankData,
    });
    console.log("Банк создан:", bank.name);
  }

  console.log("Seed завершен!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
