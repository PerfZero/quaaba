'use client';

import { useState } from 'react';
import { Typography, Flex, Input, Button, Space, Tag, Segmented, Table } from 'antd';
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

interface Integration {
  key: string;
  token: string;
  description: string;
  createdAt: string;
}

export default function IntegrationsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<Integration> = [
    {
      title: 'Токен',
      dataIndex: 'token',
      key: 'token',
      sorter: (a, b) => a.token.localeCompare(b.token),
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
  ];

  const data: Integration[] = [
    {
      key: '1',
      token: 'api_token_12345',
      description: 'API интеграция для платежной системы',
      createdAt: '01.01.2025',
    },
    {
      key: '2',
      token: 'api_token_67890',
      description: 'Интеграция с банковским API',
      createdAt: '02.01.2025',
    },
    {
      key: '3',
      token: 'api_token_abcde',
      description: 'Интеграция с системой бронирования',
      createdAt: '03.01.2025',
    },
    {
      key: '4',
      token: 'api_token_fghij',
      description: 'API для отправки уведомлений',
      createdAt: '04.01.2025',
    },
    {
      key: '5',
      token: 'api_token_klmno',
      description: 'Интеграция с CRM системой',
      createdAt: '05.01.2025',
    },
    {
      key: '6',
      token: 'api_token_pqrst',
      description: 'API для обработки заказов',
      createdAt: '06.01.2025',
    },
    {
      key: '7',
      token: 'api_token_uvwxy',
      description: 'Интеграция с почтовым сервисом',
      createdAt: '07.01.2025',
    },
    {
      key: '8',
      token: 'api_token_zabcd',
      description: 'API для аналитики',
      createdAt: '08.01.2025',
    },
  ];

  return (
    <Flex vertical gap={16}>
      {/* Первая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        {/* Блок 1: Название + количество */}
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>
            Интеграции
          </Title>
          <Tag>{100}</Tag>
        </Flex>

        {/* Блок 2: Поиск */}
        <Search
          placeholder="Поиск"
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
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: 100,
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

