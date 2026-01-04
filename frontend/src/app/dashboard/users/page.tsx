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

interface User {
  key: string;
  fullName: string;
  account: string;
  company: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<User> = [
    {
      title: 'ФИО',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Аккаунт',
      dataIndex: 'account',
      key: 'account',
      sorter: (a, b) => a.account.localeCompare(b.account),
    },
    {
      title: 'Компания',
      dataIndex: 'company',
      key: 'company',
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
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

  const data: User[] = [
    {
      key: '1',
      fullName: 'Омар Алишер',
      account: 'alisher@example.com',
      company: 'ТОО ABBA',
      role: 'Владелец',
      status: 'Активный',
    },
    {
      key: '2',
      fullName: 'Орынбек Дулат',
      account: 'dulat@example.com',
      company: 'ТОО ABBA',
      role: 'Менеджер продажи',
      status: 'Активный',
    },
    {
      key: '3',
      fullName: 'Айжан Карабаева',
      account: 'aijan@example.com',
      company: 'ИП XYZ',
      role: 'Администратор',
      status: 'Активный',
    },
    {
      key: '4',
      fullName: 'Дмитрий Смирнов',
      account: 'dmitry@example.com',
      company: 'ТОО ABBA',
      role: 'Менеджер',
      status: 'Неактивный',
    },
    {
      key: '5',
      fullName: 'Анна Петрова',
      account: 'anna@example.com',
      company: 'ИП XYZ',
      role: 'Оператор',
      status: 'Активный',
    },
    {
      key: '6',
      fullName: 'Сергей Иванов',
      account: 'sergey@example.com',
      company: 'ТОО ABBA',
      role: 'Менеджер',
      status: 'Активный',
    },
    {
      key: '7',
      fullName: 'Мария Козлова',
      account: 'maria@example.com',
      company: 'ИП XYZ',
      role: 'Оператор',
      status: 'Неактивный',
    },
    {
      key: '8',
      fullName: 'Елена Новикова',
      account: 'elena@example.com',
      company: 'ТОО ABBA',
      role: 'Администратор',
      status: 'Активный',
    },
    {
      key: '9',
      fullName: 'Алексей Волков',
      account: 'alexey@example.com',
      company: 'ИП XYZ',
      role: 'Владелец',
      status: 'Активный',
    },
    {
      key: '10',
      fullName: 'Ирина Морозова',
      account: 'irina@example.com',
      company: 'ТОО ABBA',
      role: 'Менеджер продажи',
      status: 'Активный',
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
            Пользователи
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

