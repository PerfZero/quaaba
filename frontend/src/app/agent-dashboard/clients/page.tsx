'use client';

import { Typography, Card, Table, Flex, Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ClientsPage() {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
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
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      phone: '+7 701 123 45 67',
      registrationDate: '2024-01-10',
      status: 'Активный',
    },
    {
      key: '2',
      id: 2,
      name: 'Мария Петрова',
      email: 'maria@example.com',
      phone: '+7 702 234 56 78',
      registrationDate: '2024-01-12',
      status: 'Новый',
    },
  ];

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="center">
        <Title level={2} style={{ margin: 0 }}>Клиенты</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Добавить клиента
        </Button>
      </Flex>
      
      <Card>
        <Flex gap={16} style={{ marginBottom: 16 }}>
          <Input 
            placeholder="Поиск клиентов..." 
            prefix={<SearchOutlined />}
            style={{ maxWidth: 300 }}
          />
        </Flex>
        
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Flex>
  );
}
