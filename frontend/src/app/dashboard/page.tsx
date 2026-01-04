'use client';

import { useEffect, useState } from 'react';
import { Typography, Card, Flex } from 'antd';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Flex vertical gap={24}>
      <Title level={2} style={{ margin: 0 }}>Дашборд</Title>
      
      <Card>
        <Flex vertical gap={8}>
          <Text strong>Добро пожаловать, {user?.name || 'Пользователь'}!</Text>
          <Text type="secondary">Email: {user?.email}</Text>
        </Flex>
      </Card>
    </Flex>
  );
}

