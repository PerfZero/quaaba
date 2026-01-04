'use client';

import { useState } from 'react';
import { Button, Card, Typography, Space, message } from 'antd';
import { ApiOutlined, LoginOutlined } from '@ant-design/icons';
import axios from 'axios';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Не проверено');
  const [loading, setLoading] = useState(false);

  const checkApi = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/health`);
      setApiStatus('Работает! ✅');
      message.success('Бэкенд подключен успешно!');
    } catch (error) {
      setApiStatus('Ошибка подключения ❌');
      message.error('Не удалось подключиться к бэкенду');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto' , }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={1}>🚀 Fullstack Приложение</Title>
          <Paragraph>
            Добро пожаловать в fullstack приложение на Next.js + Ant Design + Express.js
          </Paragraph>
        </Card>

        <Card>
          <Title level={2}>Статус API</Title>
          <Space direction="vertical" size="middle">
            <Paragraph>Статус бэкенда: <strong>{apiStatus}</strong></Paragraph>
            <Button 
              type="primary" 
              icon={<ApiOutlined />} 
              onClick={checkApi}
              loading={loading}
            >
              Проверить подключение к API
            </Button>
          </Space>
        </Card>

        <Card>
          <Title level={2}>Навигация</Title>
          <Space direction="vertical" size="middle">
            <Link href="/login">
              <Button 
                type="default" 
                icon={<LoginOutlined />} 
                size="large"
                block
              >
                Перейти на страницу входа
              </Button>
            </Link>
          </Space>
        </Card>

        <Card>
          <Title level={2}>Технологии</Title>
          <Space direction="vertical">
            <Paragraph>✅ Next.js 14 (App Router)</Paragraph>
            <Paragraph>✅ Ant Design 5</Paragraph>
            <Paragraph>✅ Express.js</Paragraph>
            <Paragraph>✅ Docker & Docker Compose</Paragraph>
            <Paragraph>✅ TypeScript</Paragraph>
          </Space>
        </Card>
      </Space>
    </main>
  );
}
