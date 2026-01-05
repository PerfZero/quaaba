'use client';

import { useState } from 'react';
import { Typography, Card, Flex, Button, Radio, Checkbox, message } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [cooperationType, setCooperationType] = useState('');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const tourOperators = [
    { value: 'qaaba-one', label: 'Qaaba One' },
    { value: 'atlas-tourism', label: 'Аtlas Tourism' },
    { value: 'niyet', label: 'Niyet' },
  ];

  const handleNextStep = () => {
    if (step === 1 && !cooperationType) {
      message.error('Выберите тип сотрудничества');
      return;
    }
    
    if (step === 2 && selectedOperators.length === 0) {
      message.error('Выберите хотя бы одного туроператора');
      return;
    }

    if (step === 2) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Обновляем статус онбординга в localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.onboarded = true;
      user.cooperationType = cooperationType;
      user.tourOperators = selectedOperators;
      localStorage.setItem('user', JSON.stringify(user));

      message.success('Заявка подана. Ожидайте звонка');
      
      // Задержка для показа тоаста
      setTimeout(() => {
        router.push('/agent-dashboard');
      }, 2000);
    } catch (error) {
      message.error('Ошибка отправки заявки');
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
                {step === 1 ? 'Как вы хотите сотрудничать?' : 'Выберите туроператора'}
              </Title>

              {step === 1 ? (
                <Flex vertical gap={16}>
                  <Radio.Group 
                    value={cooperationType} 
                    onChange={(e) => setCooperationType(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <Flex vertical gap={12}>
                      <Radio value="individual" style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 8, width: '100%' }}>
                        <Flex vertical gap={4}>
                          <Text strong>Как агент физ.лицо</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Работа в качестве физического лица
                          </Text>
                        </Flex>
                      </Radio>
                      
                      <Radio value="company" style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 8, width: '100%' }}>
                        <Flex vertical gap={4}>
                          <Text strong>Как турагент через ИП/ТОО</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Работа как юридическое лицо или ИП
                          </Text>
                        </Flex>
                      </Radio>
                    </Flex>
                  </Radio.Group>

                  {cooperationType === 'company' && (
                    <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                      <Flex vertical gap={8}>
                        <Text strong style={{ color: '#389e0d' }}>Добавить компанию</Text>
                        <Text style={{ fontSize: 12, color: '#52c41a' }}>
                          Чтобы добавить ТОО, ИП или самозанятого подпишите с ЭЦП.
                        </Text>
                        <Button 
                          type="link" 
                          size="small" 
                          style={{ padding: 0, height: 'auto' }}
                        >
                          Подписать в NCA Layer
                        </Button>
                      </Flex>
                    </Card>
                  )}
                </Flex>
              ) : (
                <Flex vertical gap={16}>
                  <Flex vertical gap={8}>
                    <Text strong>Выберите туроператора</Text>
                  </Flex>
                  <Checkbox.Group
                    value={selectedOperators}
                    onChange={setSelectedOperators}
                    style={{ width: '100%' }}
                  >
                    <Flex vertical gap={12}>
                      {tourOperators.map((operator) => (
                        <Checkbox key={operator.value} value={operator.value}>
                          {operator.label}
                        </Checkbox>
                      ))}
                    </Flex>
                  </Checkbox.Group>
                </Flex>
              )}
            </Flex>

            {step > 1 && (
              <Button
                size="large"
                onClick={() => setStep(step - 1)}
                block
                style={{ marginTop: -20 }}
              >
                Назад
              </Button>
            )}

            <Button
              color="default"
              variant="solid"
              size="large"
              htmlType="submit"
              onClick={handleNextStep}
              loading={loading}
              block
            >
              {step === 1 ? 'Далее' : 'Отправить'}
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}
