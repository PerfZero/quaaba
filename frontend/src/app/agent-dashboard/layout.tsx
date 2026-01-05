'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Menu, Typography, Flex, Spin, Select } from 'antd';
import {
  HomeOutlined,
  DollarOutlined,
  UserOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const agentMenuItems: MenuItem[] = [
  {
    type: 'group',
    label: 'Основные',
    children: [
      { key: 'home', label: 'Главная', icon: <HomeOutlined /> },
      { key: 'sales', label: 'Продажи', icon: <DollarOutlined /> },
      { key: 'clients', label: 'Клиенты', icon: <UserOutlined /> },
      { key: 'tours', label: 'Туры', icon: <GlobalOutlined /> },
    ],
  },
];

// Неактивные пункты меню для онбординга
const disabledMenuItems: MenuItem[] = [
  {
    type: 'group',
    label: 'Основные',
    children: [
      { key: 'home', label: 'Главная', icon: <HomeOutlined />, disabled: true },
      { key: 'sales', label: 'Продажи', icon: <DollarOutlined />, disabled: true },
      { key: 'clients', label: 'Клиенты', icon: <UserOutlined />, disabled: true },
      { key: 'tours', label: 'Туры', icon: <GlobalOutlined />, disabled: true },
    ],
  },
];

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string; onboarded?: boolean } | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Проверка роли - только агенты могут заходить на этот дашборд
      if (parsedUser.role !== 'agent') {
        router.push('/dashboard');
        return;
      }

      // Проверка онбординга
      const needsOnboarding = !parsedUser.onboarded;
      setIsOnboarding(needsOnboarding);
    }
    
    setLoading(false);
  }, [router]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // Блокируем навигацию во время онбординга
    if (isOnboarding) {
      return;
    }
    
    if (e.key === 'home') {
      router.push('/agent-dashboard');
    } else {
      router.push(`/agent-dashboard/${e.key}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
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
            style={{ width: 150 }}
            variant="borderless"
            options={[
              { value: 'qaabaone', label: 'ТОО QaabaOne' },
            ]}
          />
          <Text>Агент</Text>
          <Text strong>{user?.name || 'Пользователь'}</Text>
          <LogoutOutlined 
            style={{ cursor: 'pointer' }} 
            onClick={handleLogout}
          />
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
            items={isOnboarding ? disabledMenuItems : agentMenuItems}
            onClick={handleMenuClick}
            style={{ 
              borderRight: 0,
              background: 'transparent',
            }}
          />
        </Sider>
        <Layout>
          <Content style={{ 
            padding: isOnboarding ? 0 : 24, 
            background: isOnboarding ? 'transparent' : '#fff',
            borderRadius: isOnboarding ? 0 : 8,
            border: isOnboarding ? 'none' : '1px solid #00000010' 
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
