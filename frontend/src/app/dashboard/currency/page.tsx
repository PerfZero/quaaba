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

interface Currency {
  key: string;
  usd: string;
  kztMig: string;
  kztSystem: string;
  date: string;
  source: string;
}

export default function CurrencyPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<Currency> = [
    {
      title: 'USD',
      dataIndex: 'usd',
      key: 'usd',
      sorter: (a, b) => parseFloat(a.usd) - parseFloat(b.usd),
    },
    {
      title: 'KZT МиГ',
      dataIndex: 'kztMig',
      key: 'kztMig',
      sorter: (a, b) => parseFloat(a.kztMig) - parseFloat(b.kztMig),
    },
    {
      title: 'KZT Системный',
      dataIndex: 'kztSystem',
      key: 'kztSystem',
      sorter: (a, b) => parseFloat(a.kztSystem) - parseFloat(b.kztSystem),
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: 'Источник',
      dataIndex: 'source',
      key: 'source',
      sorter: (a, b) => a.source.localeCompare(b.source),
    },
  ];

  const data: Currency[] = [
    {
      key: '1',
      usd: '1.00',
      kztMig: '450.50',
      kztSystem: '450.00',
      date: '01.01.2025',
      source: 'НБРК',
    },
    {
      key: '2',
      usd: '1.00',
      kztMig: '451.00',
      kztSystem: '450.50',
      date: '02.01.2025',
      source: 'НБРК',
    },
    {
      key: '3',
      usd: '1.00',
      kztMig: '449.75',
      kztSystem: '449.50',
      date: '03.01.2025',
      source: 'НБРК',
    },
    {
      key: '4',
      usd: '1.00',
      kztMig: '452.25',
      kztSystem: '451.75',
      date: '04.01.2025',
      source: 'НБРК',
    },
    {
      key: '5',
      usd: '1.00',
      kztMig: '450.00',
      kztSystem: '449.75',
      date: '05.01.2025',
      source: 'НБРК',
    },
    {
      key: '6',
      usd: '1.00',
      kztMig: '451.50',
      kztSystem: '451.00',
      date: '06.01.2025',
      source: 'НБРК',
    },
    {
      key: '7',
      usd: '1.00',
      kztMig: '450.25',
      kztSystem: '450.00',
      date: '07.01.2025',
      source: 'НБРК',
    },
    {
      key: '8',
      usd: '1.00',
      kztMig: '451.75',
      kztSystem: '451.25',
      date: '08.01.2025',
      source: 'НБРК',
    },
  ];

  return (
    <Flex vertical gap={16}>
      {/* Первая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        {/* Блок 1: Название + количество */}
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>
            Курс валют
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

