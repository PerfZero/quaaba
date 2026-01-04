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

interface TourOperator {
  key: string;
  name: string;
  bin: string;
  address: string;
  license: string;
  travelAgent: string;
  status: string;
}

export default function TourOperatorsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<TourOperator> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'БИН',
      dataIndex: 'bin',
      key: 'bin',
      sorter: (a, b) => a.bin.localeCompare(b.bin),
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: 'Лицензия',
      dataIndex: 'license',
      key: 'license',
      sorter: (a, b) => a.license.localeCompare(b.license),
    },
    {
      title: 'Турагент',
      dataIndex: 'travelAgent',
      key: 'travelAgent',
      sorter: (a, b) => a.travelAgent.localeCompare(b.travelAgent),
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

  const data: TourOperator[] = [
    { key: '1', name: 'ТОО "Казахстан Туры"', bin: '930718300600', address: 'г. Алматы, ул. Абая, 150', license: 'ТУР-001', travelAgent: 'Да', status: 'Активный' },
    { key: '2', name: 'ТОО "ТурОператор Астана"', bin: '930718300601', address: 'г. Астана, пр. Кабанбай батыра, 20', license: 'ТУР-002', travelAgent: 'Нет', status: 'Активный' },
    { key: '3', name: 'ИП "Азия Тур"', bin: '930718300602', address: 'г. Алматы, ул. Сатпаева, 30', license: 'ТУР-003', travelAgent: 'Да', status: 'Активный' },
    { key: '4', name: 'ТОО "Степные маршруты"', bin: '930718300603', address: 'г. Шымкент, ул. Тауке хана, 45', license: 'ТУР-004', travelAgent: 'Нет', status: 'Активный' },
    { key: '5', name: 'ТОО "Великий Шелковый путь"', bin: '930718300604', address: 'г. Алматы, пр. Достык, 180', license: 'ТУР-005', travelAgent: 'Да', status: 'Активный' },
    { key: '6', name: 'ТОО "Экспресс Тур"', bin: '930718300605', address: 'г. Актау, ул. Абая, 12', license: 'ТУР-006', travelAgent: 'Да', status: 'Активный' },
    { key: '7', name: 'ИП "Байкал Тур"', bin: '930718300606', address: 'г. Караганда, пр. Бухар жырау, 32', license: 'ТУР-007', travelAgent: 'Нет', status: 'Неактивный' },
    { key: '8', name: 'ТОО "Золотой Алтын"', bin: '930718300607', address: 'г. Алматы, ул. Гоголя, 85', license: 'ТУР-008', travelAgent: 'Да', status: 'Активный' },
    { key: '9', name: 'ТОО "Сарыарка Тур"', bin: '930718300608', address: 'г. Астана, ул. Бейбитшилик, 15', license: 'ТУР-009', travelAgent: 'Нет', status: 'Активный' },
    { key: '10', name: 'ТОО "Каспийские туры"', bin: '930718300609', address: 'г. Атырау, ул. Исатая, 25', license: 'ТУР-010', travelAgent: 'Да', status: 'Активный' },
  ];

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>Туроператоры</Title>
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

