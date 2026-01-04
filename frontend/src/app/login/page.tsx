'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography, message, Flex, Card } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка входа');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      message.success('Вход выполнен успешно!');
      router.push('/dashboard');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ошибка входа. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex vertical style={{ minHeight: '100vh', background: '#F9FAFA' }}>
      {/* Header */}
      <Flex align="center" style={{ padding: '4px 16px', height: 60 }}>
        <Flex align="end" gap={4}>
          <div style={{ width: 28, height: 28, background: '#08918B' }} />
          <Text strong style={{ fontSize: 16, lineHeight: 1.15 }}>Qaaba1One</Text>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Flex vertical align="center" justify="center" flex={1} gap={16} style={{ padding: 24 }}>
        <Card style={{ width: 320, borderRadius: 24 }}>
          <Flex vertical gap={40}>
            <Flex vertical gap={24}>
              <Title level={2} style={{ margin: 0 }}>Войти</Title>

              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  label="Вход по эл.почте"
                  rules={[
                    { required: true, message: 'Введите email' },
                    { type: 'email', message: 'Введите корректный email' }
                  ]}
                >
                  <Input placeholder="example@mail.com" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Введите пароль' },
                    { min: 6, message: 'Пароль должен быть не менее 6 символов' }
                  ]}
                >
                  <Input.Password placeholder="Введите пароль" />
                </Form.Item>

                <Flex justify="end">
                  <Link href="/forgot-password">
                    <Text type="secondary" style={{ fontSize: 14 }}>Забыл пароль</Text>
                  </Link>
                </Flex>
              </Form>
            </Flex>

            <Button
              color="default"
              variant="solid"
              size="large"
              htmlType="submit"
              onClick={() => form.submit()}
              loading={loading}
              block
            >
              Далее
            </Button>
          </Flex>
        </Card>

        <Link href="/register">
          <Text type="secondary" style={{ fontSize: 16 }}>Создать аккаунт</Text>
        </Link>
      </Flex>
    </Flex>
  );
}
