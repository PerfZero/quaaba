'use client';

import { useEffect, useRef, useState } from 'react';
import { Typography, Card, Flex, Row, Col, Statistic, Table, Tag, Button, Progress, Input, Space, Segmented, Badge, Spin, Popconfirm, Modal, message } from 'antd';
import { 
  HomeOutlined, 
  DollarOutlined, 
  UserOutlined, 
  GlobalOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined, 
  CloudUploadOutlined, 
  MoreOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import OnboardingContent from './components/OnboardingContent';

const { Title, Text } = Typography;
const { Search } = Input;

interface SaleData {
  key: string;
  name: string;
  days: number;
  startDate: string;
  percent: number;
  quantity: number;
  totalQuantity: number;
  amount: string;
  totalAmount: string;
  color: string;
}

 const DEMO_SALES_DATA: SaleData[] = [
   {
     key: '1',
     name: 'Умра 2025',
     days: 15,
     startDate: '05.01.2025',
     percent: 85,
     quantity: 85,
     totalQuantity: 100,
     amount: '2 150 000',
     totalAmount: '2 529 412',
     color: '#52c41a'
   },
   {
     key: '2',
     name: 'Умра Премиум',
     days: 20,
     startDate: '05.01.2025',
     percent: 60,
     quantity: 60,
     totalQuantity: 100,
     amount: '3 600 000',
     totalAmount: '6 000 000',
     color: '#1890ff'
   },
   {
     key: '3',
     name: 'Умра Стандарт',
     days: 10,
     startDate: '05.01.2025',
     percent: 95,
     quantity: 95,
     totalQuantity: 100,
     amount: '1 425 000',
     totalAmount: '1 500 000',
     color: '#52c41a'
   },
   {
     key: '4',
     name: 'Умра Эконом',
     days: 12,
     startDate: '05.01.2025',
     percent: 40,
     quantity: 40,
     totalQuantity: 100,
     amount: '800 000',
     totalAmount: '2 000 000',
     color: '#faad14'
   },
   {
     key: '5',
     name: 'Умра Люкс',
     days: 18,
     startDate: '05.01.2025',
     percent: 25,
     quantity: 25,
     totalQuantity: 100,
     amount: '1 250 000',
     totalAmount: '5 000 000',
     color: '#ff4d4f'
   },
 ];

export default function AgentDashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string; onboarded?: boolean } | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const demoInfoOpenedRef = useRef(false);

  const [salesData, setSalesData] = useState<SaleData[]>(DEMO_SALES_DATA);
  const [isDemoData, setIsDemoData] = useState(true);

  const demoCount = isDemoData ? 99 : 0;

  // Фильтрация данных
  const filteredData = salesData.filter(item => {
    if (activeFilter === 'Активные') {
      return item.percent > 50; // Активные те, где процент > 50
    }
    return true;
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Удаление выбранных
  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Выберите элементы для удаления');
      return;
    }

    Modal.confirm({
      title: 'Удалить выбранные элементы?',
      content: `Вы уверены, что хотите удалить ${selectedRowKeys.length} элементов?`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => {
        message.success(`Удалено элементов: ${selectedRowKeys.length}`);
        setSelectedRowKeys([]);
      },
    });
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    let localNeedsOnboarding = false;
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      localNeedsOnboarding = !parsedUser.onboarded;
      setNeedsOnboarding(localNeedsOnboarding);
    }

    const demoDeletedKey = 'agent_demo_deleted_v1';
    const demoDeleted = localStorage.getItem(demoDeletedKey) === '1';
    if (demoDeleted) {
      setIsDemoData(false);
      setSalesData([]);
      return;
    }

    if (demoInfoOpenedRef.current || localNeedsOnboarding) {
      return;
    }

    demoInfoOpenedRef.current = true;

    Modal.info({
      title: null,
      icon: null,
      mask: false,
      wrapClassName: 'demo-data-modal-bottom-right',
      content: (
        <Flex vertical gap={8}>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Вам показаны демо-данные
          </Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Нажмите на кнопку чтобы стереть их
          </Text>
        </Flex>
      ),
      okText: 'Удалить демо данные',
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.setItem(demoDeletedKey, '1');
        setIsDemoData(false);
        setSalesData([]);
        setSelectedRowKeys([]);
        message.success('Демо-данные успешно удалены');
      },
      width: 380,
    });
  }, []);

  // Если нужен онбординг, показываем его
  if (needsOnboarding) {
    return <OnboardingContent />;
  }

  const columns: ColumnsType<SaleData> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Дней',
      dataIndex: 'days',
      key: 'days',
      width: 80,
      sorter: (a, b) => a.days - b.days,
    },
    {
      title: 'Дата начала',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 140,
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
    },
    {
      title: 'Процент',
      dataIndex: 'percent',
      key: 'percent',
      width: 500,
      sorter: (a, b) => a.percent - b.percent,
      render: (percent: number, record: SaleData) => (
        <Progress 
          percent={percent} 
          size="small" 
          strokeColor={record.color}
          format={() => `${percent}%`}
        />
      )
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity: number, record: SaleData) => (
        <Text>{quantity}/{record.totalQuantity}</Text>
      )
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => parseInt(a.amount.replace(/\s/g, '')) - parseInt(b.amount.replace(/\s/g, '')),
      render: (amount: string, record: SaleData) => (
        <Text>{amount} / {record.totalAmount}</Text>
      )
    },
  ];

  return (
    <Flex vertical gap={16}>
      {/* Первая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        {/* Блок 1: Название + количество */}
        <Flex align="center" gap={12}>
          <Title level={4} style={{ margin: 0 }}>
            Главная
          </Title>
        <Badge color="gray" count={demoCount} />
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
              color={activeFilter === 'Все' ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter('Все')}
            >
              Все
            </Tag>
          </Space>
          <Button icon={<FilterOutlined />}>
            Фильтры
          </Button>
        </Flex>
      </Flex>

 

      {/* Статистические карточки */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 16 }}>
            <Flex vertical gap={8}>
              <Text type="secondary" style={{ fontSize: 12 }}>Мои продажи за сегодня</Text>
              <Title level={3} style={{ margin: 0 }}>{isDemoData ? '8 600 000 KZT' : '0 KZT'}</Title>
              <Flex align="center" gap={6}>
                <Text style={{ fontSize: 12 }}>Больше чем вчера {isDemoData ? '12%' : '0%'}</Text>
                <ArrowUpOutlined style={{ color: '#52c41a' }} />
              </Flex>
              <div style={{ height: 1, background: '#f0f0f0', margin: '8px 0' }} />
              <Flex justify="space-between" align="center">
                <Text type="secondary" style={{ fontSize: 12 }}>Количество</Text>
                <Text style={{ fontSize: 12 }}>{isDemoData ? 25 : 0}</Text>
              </Flex>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 16 }}>
            <Flex vertical gap={8}>
              <Text type="secondary" style={{ fontSize: 12 }}>Мои продажи за неделю</Text>
              <Title level={3} style={{ margin: 0 }}>{isDemoData ? '28 600 000 KZT' : '0 KZT'}</Title>
              <Flex align="center" gap={6}>
                <Text style={{ fontSize: 12 }}>Меньше чем прошлая неделя {isDemoData ? '12%' : '0%'}</Text>
                <ArrowUpOutlined style={{ color: '#52c41a' }} />
              </Flex>
              <div style={{ height: 1, background: '#f0f0f0', margin: '8px 0' }} />
              <Flex justify="space-between" align="center">
                <Text type="secondary" style={{ fontSize: 12 }}>Количество</Text>
                <Text style={{ fontSize: 12 }}>{isDemoData ? 120 : 0}</Text>
              </Flex>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9', borderRadius: 16 }}>
            <Flex vertical gap={8}>
              <Text type="secondary" style={{ fontSize: 12 }}>Неподтвержденная сумма</Text>
              <Title level={3} style={{ margin: 0 }}>{isDemoData ? '2 600 000 KZT' : '0 KZT'}</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Ожидает подтверждения туроператора</Text>
              <div style={{ height: 1, background: '#f0f0f0', margin: '8px 0' }} />
              <Flex justify="space-between" align="center">
                <Text type="secondary" style={{ fontSize: 12 }}>Количество</Text>
                <Text style={{ fontSize: 12 }}>{isDemoData ? 6 : 0}</Text>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Таблица */}
      <Flex vertical gap={16}>
        <Flex align="center" gap={12}>
          <Title level={4} style={{ margin: 0 }}>Продажи</Title>
          <Badge color="gray" count={demoCount} />
        </Flex>
        
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowSelection={rowSelection}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredData.length,
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
        </Spin>
      </Flex>
    </Flex>
  );
}
