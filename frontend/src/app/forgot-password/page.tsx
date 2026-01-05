'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography, message, Flex, Card } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const router = useRouter();

  const onFinishStep1 = async (values: { email: string }) => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет API запрос для отправки кода
      // Сейчас просто имитируем отправку
      setEmail(values.email);
      setStep(2);
      message.success('Код восстановления отправлен на email');
    } catch (error) {
      message.error('Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const onFinishStep2 = async (values: { code: string; newPassword: string }) => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет API запрос для подтверждения и смены пароля
      message.success('Пароль успешно изменен');
      router.push('/login');
    } catch (error) {
      message.error('Ошибка смены пароля');
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
              <Title level={2} style={{ margin: 0 }}>
                {step === 1 ? 'Восстановление пароля' : 'Введите код'}
              </Title>

              {step === 1 ? (
                <Form
                  form={form}
                  name="forgot-password"
                  onFinish={onFinishStep1}
                  layout="vertical"
                  size="large"
                  autoComplete="off"
                >
                  <Form.Item
                    name="email"
                    label="Эл.почта"
                    rules={[
                      { required: true, message: 'Введите email' },
                      { type: 'email', message: 'Введите корректный email' }
                    ]}
                  >
                    <Input placeholder="example@mail.com" />
                  </Form.Item>
                </Form>
              ) : (
                <Form
                  form={form}
                  name="reset-password"
                  onFinish={onFinishStep2}
                  layout="vertical"
                  size="large"
                  autoComplete="off"
                >
                  <Flex vertical gap={16}>
                    <Text type="secondary">
                      Введите код отправленный на
                    </Text>
                    <Text strong>{email}</Text>
                    
                    <Form.Item
                      name="code"
                      rules={[{ required: true, message: 'Введите код подтверждения' }]}
                    >
                      <Input placeholder="Код" maxLength={6} />
                    </Form.Item>

                    <Form.Item
                      name="newPassword"
                      label="Новый пароль"
                      rules={[
                        { required: true, message: 'Введите новый пароль' },
                        { min: 6, message: 'Пароль должен быть не менее 6 символов' }
                      ]}
                    >
                      <Input.Password placeholder="Введите новый пароль" />
                    </Form.Item>
                  </Flex>
                </Form>
              )}
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
              {step === 1 ? 'Отправить код' : 'Сменить пароль'}
            </Button>
          </Flex>
        </Card>

        <Link href="/login">
          <Text type="secondary" style={{ fontSize: 16 }}>Вернуться к входу</Text>
        </Link>
      </Flex>
    </Flex>
  );
}
