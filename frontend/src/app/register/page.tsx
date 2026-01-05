'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography, message, Flex, Card, Checkbox } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface PasswordValidation {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const validatePassword = (pwd: string): PasswordValidation => ({
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  });

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const startCountdown = () => {
    setCountdown(22);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onFinishStep1 = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.validation) {
          throw new Error('Пароль не соответствует требованиям');
        }
        throw new Error(data.message || 'Ошибка регистрации');
      }

      setEmail(values.email);
      setPassword(values.password);
      setStep(2);
      startCountdown();
      message.success('Код подтверждения отправлен на email');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const onFinishStep2 = async (values: { code: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: values.code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка подтверждения');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      message.success('Регистрация успешно завершена!');
      
      // Всегда редиректим на агентский дашборд (онбординг будет внутри)
      router.push('/agent-dashboard');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ошибка подтверждения');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка отправки кода');
      }

      message.success('Код повторно отправлен');
      startCountdown();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ошибка отправки кода');
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
                {step === 1 ? 'Создать аккаунт' : 'Введите код'}
              </Title>

              {step === 1 ? (
                <Form
                  form={form}
                  name="register"
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

                  <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[
                      { required: true, message: 'Введите пароль' },
                      { validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const validation = validatePassword(value);
                        const isValid = Object.values(validation).every(Boolean);
                        if (!isValid) {
                          return Promise.reject('Пароль не соответствует требованиям');
                        }
                        return Promise.resolve();
                      }}
                    ]}
                  >
                    <Input.Password 
                      placeholder="Введите пароль" 
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>

                  <Flex vertical gap={8} style={{ marginTop: 8 }}>
                    <Text style={{ fontSize: 12, color: '#666' }}>Пароль должен содержать:</Text>
                    <Flex vertical gap={4}>
                      <Flex align="center" gap={8}>
                        <Text style={{ 
                          color: passwordValidation.minLength ? '#52c41a' : '#d9d9d9',
                          fontSize: 14
                        }}>
                          {passwordValidation.minLength ? '✓' : '✓'}
                        </Text>
                        <Text style={{ 
                          color: passwordValidation.minLength ? '#52c41a' : '#666',
                          fontSize: 12
                        }}>
                          Минимум 8 символов
                        </Text>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <Text style={{ 
                          color: passwordValidation.hasUpper ? '#52c41a' : '#d9d9d9',
                          fontSize: 14
                        }}>
                          {passwordValidation.hasUpper ? '✓' : '✓'}
                        </Text>
                        <Text style={{ 
                          color: passwordValidation.hasUpper ? '#52c41a' : '#666',
                          fontSize: 12
                        }}>
                          Заглавную букву (ABC)
                        </Text>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <Text style={{ 
                          color: passwordValidation.hasLower ? '#52c41a' : '#d9d9d9',
                          fontSize: 14
                        }}>
                          {passwordValidation.hasLower ? '✓' : '✓'}
                        </Text>
                        <Text style={{ 
                          color: passwordValidation.hasLower ? '#52c41a' : '#666',
                          fontSize: 12
                        }}>
                          Строчную букву (abc)
                        </Text>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <Text style={{ 
                          color: passwordValidation.hasNumber ? '#52c41a' : '#d9d9d9',
                          fontSize: 14
                        }}>
                          {passwordValidation.hasNumber ? '✓' : '✓'}
                        </Text>
                        <Text style={{ 
                          color: passwordValidation.hasNumber ? '#52c41a' : '#666',
                          fontSize: 12
                        }}>
                          Цифры (123)
                        </Text>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <Text style={{ 
                          color: passwordValidation.hasSpecial ? '#52c41a' : '#d9d9d9',
                          fontSize: 14
                        }}>
                          {passwordValidation.hasSpecial ? '✓' : '✓'}
                        </Text>
                        <Text style={{ 
                          color: passwordValidation.hasSpecial ? '#52c41a' : '#666',
                          fontSize: 12
                        }}>
                          Спецсимволы (!@#)
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Form>
              ) : (
                <Form
                  form={form}
                  name="confirm"
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

                    <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                      Тестовый код: <Text strong>123456</Text>
                    </Text>

                    <Flex justify="space-between" align="center">
                      <Button
                        type="link"
                        size="small"
                        disabled={countdown > 0}
                        onClick={resendCode}
                      >
                        {countdown > 0 ? `Отправить код через ${countdown} сек.` : 'Отправить код повторно'}
                      </Button>
                    </Flex>
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
              disabled={step === 1 && !isPasswordValid}
            >
              {step === 1 ? 'Далее' : 'Завершить регистрацию'}
            </Button>
          </Flex>
        </Card>

        <Link href="/login">
          <Text type="secondary" style={{ fontSize: 16 }}>Уже есть аккаунт</Text>
        </Link>
      </Flex>
    </Flex>
  );
}
