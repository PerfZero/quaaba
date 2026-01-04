'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Menu, Typography, Flex, Spin, Select } from 'antd';
import {
  SettingOutlined,
  BankOutlined,
  DollarOutlined,
  ApiOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  RocketOutlined,
  HomeOutlined,
  CarOutlined,
  CoffeeOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  DownOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    type: 'group',
    label: 'Настройки',
    children: [
      { key: 'companies', label: 'Компании', icon: <BankOutlined /> },
      { key: 'currency', label: 'Валюта', icon: <DollarOutlined /> },
      { key: 'integrations', label: 'Интеграции', icon: <ApiOutlined /> },
    ],
  },
  {
    type: 'group',
    label: 'СУД',
    children: [
      { key: 'users', label: 'Пользователи', icon: <UserOutlined /> },
      { key: 'roles', label: 'Роли', icon: <TeamOutlined /> },
      { key: 'access', label: 'Доступы', icon: <SafetyOutlined /> },
    ],
  },
  {
    type: 'group',
    label: 'Реестр',
    children: [
      { key: 'cities', label: 'Города', icon: <EnvironmentOutlined /> },
      { key: 'airlines', label: 'Авиакомпании', icon: <RocketOutlined /> },
      { key: 'hotels', label: 'Отели', icon: <HomeOutlined /> },
      { key: 'transport', label: 'Транспорты', icon: <CarOutlined /> },
      { key: 'food', label: 'Питание', icon: <CoffeeOutlined /> },
      { key: 'rooms', label: 'Комнаты', icon: <AppstoreOutlined /> },
      { key: 'banks', label: 'Банки', icon: <CreditCardOutlined /> },
      { key: 'extra-services', label: 'Допуслуги', icon: <PlusCircleOutlined /> },
      { key: 'tour-operators', label: 'Туроператоры', icon: <ShopOutlined /> },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    router.push(`/dashboard/${e.key}`);
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' ,  background: '#F5F5F5' }}>
      <Header style={{ 
        background: '#F5F5F5', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
       
      }}>
        <div style={{ width: 28, height: 28, background: '#08918B' }} />
        <Flex align="center" gap={16}>
          <Select
            defaultValue="qaabaone"
            suffixIcon={<DownOutlined />}
            style={{ width: 150 }}
            variant="borderless"
            options={[
              { value: 'qaabaone', label: 'ТОО QaabaOne' },
            ]}
          />
          <Text>Менеджер</Text>
          <Text strong>Алишер</Text>
        </Flex>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          width={256}
          trigger={null}
          style={{
            background: '#F5F5F5',
            borderRadius: 24,
          }}
        >
          <Menu
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            style={{ 
              borderRight: 0,
              background: 'transparent',
            }}
          />
        </Sider>
        <Layout>
        <Content style={{ 
    padding: 24, 
    background: '#fff',
    borderRadius: 8,
    border: '1px solid #00000010'  // 8-значный HEX с альфа-каналом 00 (полная прозрачность)
}}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
