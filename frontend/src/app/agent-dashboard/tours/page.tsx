'use client';

import { Typography, Card, Table, Flex, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ToursPage() {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название тура',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Направление',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'Длительность',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Активен' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      id: 1,
      name: 'Романтический Стамбул',
      destination: 'Турция',
      duration: '5 дней',
      price: '250 000 ₸',
      status: 'Активен',
    },
    {
      key: '2',
      id: 2,
      name: 'Пляжный отдых в Египте',
      destination: 'Египет',
      duration: '7 дней',
      price: '450 000 ₸',
      status: 'Активен',
    },
    {
      key: '3',
      id: 3,
      name: 'Горные склоны Алматы',
      destination: 'Казахстан',
      duration: '3 дня',
      price: '120 000 ₸',
      status: 'В разработке',
    },
  ];

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="center">
        <Title level={2} style={{ margin: 0 }}>Туры</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Добавить тур
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
