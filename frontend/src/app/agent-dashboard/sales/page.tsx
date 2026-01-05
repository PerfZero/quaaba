'use client';

import { Typography, Card, Table, Flex, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SalesPage() {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Клиент',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Тур',
      dataIndex: 'tour',
      key: 'tour',
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const data = [
    {
      key: '1',
      id: 1,
      client: 'Иван Иванов',
      tour: 'Тур в Стамбул',
      amount: '250 000 ₸',
      date: '2024-01-15',
      status: 'Подтверждено',
    },
    {
      key: '2',
      id: 2,
      client: 'Мария Петрова',
      tour: 'Отдых в Шарм-эш-Шейхе',
      amount: '450 000 ₸',
      date: '2024-01-14',
      status: 'В обработке',
    },
  ];

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="center">
        <Title level={2} style={{ margin: 0 }}>Продажи</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Новая продажа
        </Button>
      </Flex>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Flex>
  );
}
