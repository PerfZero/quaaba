'use client';

import { useState } from 'react';
import { Typography, Flex, Input, Button, Space, Tag, Segmented, Table, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  PlusOutlined, 
  CloudUploadOutlined, 
  MoreOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  UnorderedListOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

interface Role {
  key: string;
  role: string;
  code: string;
  description: string;
  createdAt: string;
  status: string;
}

export default function RolesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<Role> = [
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Badge 
          status={status === 'Активный' ? 'success' : 'warning'} 
          text={
            <span style={{ color: status === 'Активный' ? '#52c41a' : '#faad14' }}>
              {status}
            </span>
          } 
        />
      ),
    },
  ];

  const data: Role[] = [
    {
      key: '1',
      role: 'Администратор',
      code: 'ADMIN',
      description: 'Полный доступ ко всем функциям системы',
      createdAt: '01.01.2025',
      status: 'Активный',
    },
    {
      key: '2',
      role: 'Владелец',
      code: 'OWNER',
      description: 'Управление компанией и пользователями',
      createdAt: '01.01.2025',
      status: 'Активный',
    },
    {
      key: '3',
      role: 'Менеджер',
      code: 'MANAGER',
      description: 'Управление операциями и заказами',
      createdAt: '02.01.2025',
      status: 'Активный',
    },
    {
      key: '4',
      role: 'Менеджер продажи',
      code: 'SALES_MANAGER',
      description: 'Работа с клиентами и продажами',
      createdAt: '02.01.2025',
      status: 'Активный',
    },
    {
      key: '5',
      role: 'Оператор',
      code: 'OPERATOR',
      description: 'Обработка заказов и запросов',
      createdAt: '03.01.2025',
      status: 'Активный',
    },
    {
      key: '6',
      role: 'Бухгалтер',
      code: 'ACCOUNTANT',
      description: 'Финансовые операции и отчетность',
      createdAt: '03.01.2025',
      status: 'Активный',
    },
    {
      key: '7',
      role: 'Аналитик',
      code: 'ANALYST',
      description: 'Анализ данных и отчеты',
      createdAt: '04.01.2025',
      status: 'Неактивный',
    },
    {
      key: '8',
      role: 'Гость',
      code: 'GUEST',
      description: 'Ограниченный доступ для просмотра',
      createdAt: '04.01.2025',
      status: 'Активный',
    },
    {
      key: '9',
      role: 'Модератор',
      code: 'MODERATOR',
      description: 'Модерация контента и пользователей',
      createdAt: '05.01.2025',
      status: 'Активный',
    },
    {
      key: '10',
      role: 'Аудитор',
      code: 'AUDITOR',
      description: 'Проверка и аудит операций',
      createdAt: '05.01.2025',
      status: 'Неактивный',
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Flex vertical gap={16}>
      {/* Первая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        {/* Блок 1: Название + количество */}
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>
            Роли
          </Title>
          <Tag>{data.length}</Tag>
        </Flex>

        {/* Блок 2: Поиск */}
        <Search
          placeholder="Поиск по названию"
          allowClear
          style={{ width: 400 }}
        />

        {/* Блок 3: Фильтры */}
        <Flex gap={12} align="center">
          <Space>
            <Tag 
              color={activeFilter === 'Активные' ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter('Активные')}
            >
              Активные
            </Tag>
            <Tag 
              color={activeFilter === 'Вчера' ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter('Вчера')}
            >
              Вчера
            </Tag>
            <Tag 
              color={activeFilter === 'Сегодня' ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter('Сегодня')}
            >
              Сегодня
            </Tag>
          </Space>
          <Button icon={<FilterOutlined />}>
            Фильтры
          </Button>
        </Flex>
      </Flex>

      {/* Вторая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        {/* Блок 1: Выделить */}
        <Button icon={<CheckSquareOutlined />}>
          Выделить
        </Button>

        {/* Блок 2: Добавить, Загрузить, Еще */}
        <Flex gap={12} align="center">
          <Button icon={<PlusOutlined />}>
            Добавить
          </Button>
          <Button icon={<CloudUploadOutlined />}>
            Загрузить
          </Button>
          <Button icon={<MoreOutlined />}>
            Еще
          </Button>
        </Flex>

        {/* Блок 3: Смена вида */}
        <Segmented
          options={[
            { label: <UnorderedListOutlined />, value: 'list' },
            { label: <AppstoreOutlined />, value: 'grid' },
          ]}
          value={viewMode}
          onChange={(value) => setViewMode(value as 'list' | 'grid')}
        />
      </Flex>

      {/* Таблица */}
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data.length,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
          pageSizeOptions: ['10', '20', '50', '100'],
          locale: {
            items_per_page: '/ стр',
          },
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          onShowSizeChange: (current, size) => {
            setCurrentPage(1);
            setPageSize(size);
          },
        }}
      />
    </Flex>
  );
}

