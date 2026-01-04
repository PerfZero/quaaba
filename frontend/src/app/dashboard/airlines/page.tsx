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

interface Airline {
  key: string;
  name: string;
  description: string;
  status: string;
}

export default function AirlinesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<Airline> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
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

  const data: Airline[] = [
    { key: '1', name: 'Air Astana', description: 'Национальная авиакомпания Казахстана', status: 'Активный' },
    { key: '2', name: 'SCAT Airlines', description: 'Казахстанская авиакомпания', status: 'Активный' },
    { key: '3', name: 'Qazaq Air', description: 'Региональная авиакомпания', status: 'Активный' },
    { key: '4', name: 'Bek Air', description: 'Казахстанская авиакомпания', status: 'Активный' },
    { key: '5', name: 'Lufthansa', description: 'Немецкая авиакомпания', status: 'Активный' },
    { key: '6', name: 'Turkish Airlines', description: 'Турецкая авиакомпания', status: 'Активный' },
    { key: '7', name: 'Emirates', description: 'Авиакомпания ОАЭ', status: 'Активный' },
    { key: '8', name: 'Aeroflot', description: 'Российская авиакомпания', status: 'Неактивный' },
    { key: '9', name: 'FlyArystan', description: 'Бюджетная авиакомпания', status: 'Активный' },
    { key: '10', name: 'Kuwait Airways', description: 'Кувейтская авиакомпания', status: 'Активный' },
  ];

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>Авиакомпании</Title>
          <Tag>{data.length}</Tag>
        </Flex>
        <Search placeholder="Поиск по названию" allowClear style={{ width: 400 }} />
        <Flex gap={12} align="center">
          <Space>
            <Tag color={activeFilter === 'Активные' ? 'blue' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setActiveFilter('Активные')}>Активные</Tag>
            <Tag color={activeFilter === 'Вчера' ? 'blue' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setActiveFilter('Вчера')}>Вчера</Tag>
            <Tag color={activeFilter === 'Сегодня' ? 'blue' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setActiveFilter('Сегодня')}>Сегодня</Tag>
          </Space>
          <Button icon={<FilterOutlined />}>Фильтры</Button>
        </Flex>
      </Flex>
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Button icon={<CheckSquareOutlined />}>Выделить</Button>
        <Flex gap={12} align="center">
          <Button icon={<PlusOutlined />}>Добавить</Button>
          <Button icon={<CloudUploadOutlined />}>Загрузить</Button>
          <Button icon={<MoreOutlined />}>Еще</Button>
        </Flex>
        <Segmented options={[{ label: <UnorderedListOutlined />, value: 'list' }, { label: <AppstoreOutlined />, value: 'grid' }]} value={viewMode} onChange={(value) => setViewMode(value as 'list' | 'grid')} />
      </Flex>
      <Table columns={columns} dataSource={data} rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }} pagination={{ current: currentPage, pageSize, total: data.length, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`, pageSizeOptions: ['10', '20', '50', '100'], locale: { items_per_page: '/ стр' }, onChange: (page, size) => { setCurrentPage(page); setPageSize(size); }, onShowSizeChange: (current, size) => { setCurrentPage(1); setPageSize(size); } }} />
    </Flex>
  );
}

