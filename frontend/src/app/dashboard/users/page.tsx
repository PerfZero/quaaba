'use client';

import { useState, useEffect } from 'react';
import { Typography, Flex, Input, Button, Space, Tag, Segmented, Table, Badge, Drawer, Divider, Form, Select, Switch, message, Spin, Modal, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  PlusOutlined, 
  CloudUploadOutlined, 
  MoreOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  CheckOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface User {
  key: string;
  id: number;
  fullName: string;
  account: string;
  company: string;
  companyId: number | null;
  role: string;
  roleId: number | null;
  status: string;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: number;
  name: string;
  code: string;
}

interface Company {
  id: number;
  name: string;
  inn: string;
}

export default function UsersPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const result = await response.json();
      if (result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Ошибка при загрузке пользователей');
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/users/roles/list`);
      const result = await response.json();
      if (result.data) {
        setRoles(result.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_URL}/users/companies/list`);
      const result = await response.json();
      if (result.data) {
        setCompanies(result.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchRoles(), fetchCompanies()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Create user
  const handleCreateUser = async (values: { fullName: string; account: string; status: boolean; companyId: number; roleId: number }) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        message.success('Пользователь успешно создан');
        setAddDrawerOpen(false);
        form.resetFields();
        fetchUsers();
      } else {
        message.error(result.message || 'Ошибка при создании пользователя');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Ошибка при создании пользователя');
    } finally {
      setSaving(false);
    }
  };

  // Update user
  const handleUpdateUser = async (values: { fullName: string; account: string; status: boolean; companyId: number; roleId: number }) => {
    if (!selectedUser) return;
    
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        message.success('Пользователь успешно обновлен');
        setIsEditing(false);
        
        // Обновляем данные пользователя
        const userResponse = await fetch(`${API_URL}/users/${selectedUser.id}`);
        const userResult = await userResponse.json();
        if (userResult.data) {
          const formattedUser = {
            key: userResult.data.id.toString(),
            id: userResult.data.id,
            fullName: userResult.data.fullName,
            account: userResult.data.account,
            company: userResult.data.company?.name || '-',
            companyId: userResult.data.companyId,
            role: userResult.data.role?.name || '-',
            roleId: userResult.data.roleId,
            status: userResult.data.status === 'active' ? 'Активный' : 'Неактивный',
            isSuperAdmin: userResult.data.isSuperAdmin,
            createdAt: userResult.data.createdAt,
            updatedAt: userResult.data.updatedAt,
          };
          setSelectedUser(formattedUser);
        }
        
        // Обновляем список пользователей
        fetchUsers();
      } else {
        message.error(result.message || 'Ошибка при обновлении пользователя');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Ошибка при обновлении пользователя');
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        message.success('Пользователь успешно удален');
        fetchUsers();
        if (selectedUser?.id === userId) {
          setDrawerOpen(false);
          setSelectedUser(null);
          setIsEditing(false);
        }
      } else {
        message.error(result.message || 'Ошибка при удалении пользователя');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Ошибка при удалении пользователя');
    }
  };

  // Delete selected users
  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Выберите пользователей для удаления');
      return;
    }

    // Фильтруем суперадминов из выбранных
    const usersToDelete = users.filter(user => 
      selectedRowKeys.includes(user.id.toString()) && !user.isSuperAdmin
    );

    if (usersToDelete.length === 0) {
      message.warning('Суперадминов нельзя удалять');
      return;
    }

    const superAdminCount = selectedRowKeys.length - usersToDelete.length;
    const messageText = superAdminCount > 0 
      ? `Вы уверены, что хотите удалить ${usersToDelete.length} пользователей? (${superAdminCount} суперадминов пропущено)`
      : `Вы уверены, что хотите удалить ${usersToDelete.length} пользователей?`;

    Modal.confirm({
      title: 'Удалить выбранных пользователей?',
      content: messageText,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          const deletePromises = usersToDelete.map(user => 
            fetch(`${API_URL}/users/${user.id}`, { method: 'DELETE' })
          );
          await Promise.all(deletePromises);
          message.success(`Удалено пользователей: ${usersToDelete.length}`);
          setSelectedRowKeys([]);
          fetchUsers();
        } catch (error) {
          console.error('Error deleting users:', error);
          message.error('Ошибка при удалении пользователей');
        }
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ФИО',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Аккаунт',
      dataIndex: 'account',
      key: 'account',
      sorter: (a, b) => a.account.localeCompare(b.account),
    },
    {
      title: 'Компания',
      dataIndex: 'company',
      key: 'company',
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Badge 
          status={status === 'Активный' ? 'success' : 'warning'} 
          text={
            <span style={{ color: status === 'Активный' ? '#52c41a' : '#faad14' }}>
              {status}
            </span>
          } 
        />
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        !record.isSuperAdmin ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Popconfirm
              title="Удалить пользователя?"
              description={`Вы уверены, что хотите удалить ${record.fullName}?`}
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Удалить"
              okType="danger"
              cancelText="Отмена"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </div>
        ) : null
      ),
    },
  ];

  // Filter users based on active filter
  const filteredUsers = users.filter(user => {
    if (activeFilter === 'Активные') {
      return user.status === 'Активный';
    }
    return true;
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Flex vertical gap={16}>
      {/* Первая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        {/* Блок 1: Название + количество */}
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>
            Пользователи
          </Title>
          <Tag>{users.length}</Tag>
        </Flex>

        {/* Блок 2: Поиск */}
        <Search
          placeholder="Поиск по названию"
          allowClear
          style={{ width: 400 }}
        />

        {/* Блок 3: Фильтры */}
        <Flex gap={12} align="center">
          <Space>
            <Tag 
              color={activeFilter === 'Активные' ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter('Активные')}
            >
              Активные
            </Tag>
            <Tag 
              color={activeFilter === 'Все' ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter('Все')}
            >
              Все
            </Tag>
          </Space>
          <Button icon={<FilterOutlined />}>
            Фильтры
          </Button>
        </Flex>
      </Flex>

      {/* Вторая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        {/* Блок 1: Выделить, Удалить выбранные */}
        <Flex gap={12} align="center">
          <Button icon={<CheckSquareOutlined />}>
            Выделить
          </Button>
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title="Удалить выбранных пользователей?"
              description={`Вы уверены, что хотите удалить ${selectedRowKeys.length} пользователей?`}
              onConfirm={handleDeleteSelected}
              okText="Удалить"
              okType="danger"
              cancelText="Отмена"
            >
              <Button danger icon={<DeleteOutlined />}>
                Удалить ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          )}
        </Flex>

        {/* Блок 2: Добавить, Загрузить, Еще */}
        <Flex gap={12} align="center">
          <Button icon={<PlusOutlined />} onClick={() => setAddDrawerOpen(true)}>
            Добавить
          </Button>
          <Button icon={<CloudUploadOutlined />}>
            Загрузить
          </Button>
          <Button icon={<MoreOutlined />}>
            Еще
          </Button>
        </Flex>

        {/* Блок 3: Смена вида */}
        <Segmented
          options={[
            { label: <UnorderedListOutlined />, value: 'list' },
            { label: <AppstoreOutlined />, value: 'grid' },
          ]}
          value={viewMode}
          onChange={(value) => setViewMode(value as 'list' | 'grid')}
        />
      </Flex>

      {/* Таблица */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowSelection={rowSelection}
          onRow={(record) => ({
            onClick: () => {
              setSelectedUser(record);
              setIsEditing(false);
              editForm.resetFields();
              setDrawerOpen(true);
            },
            style: { cursor: 'pointer' },
          })}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredUsers.length,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
            pageSizeOptions: ['10', '20', '50', '100'],
            locale: {
              items_per_page: '/ стр',
            },
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            onShowSizeChange: (current, size) => {
              setCurrentPage(1);
              setPageSize(size);
            },
          }}
        />
      </Spin>

      {/* Drawer с деталями пользователя */}
      <Drawer
        title={selectedUser ? `${selectedUser.fullName} / ${selectedUser.account}` : ''}
        placement="right"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setIsEditing(false);
          editForm.resetFields();
        }}
        size="large"
        styles={{ wrapper: { width: 860 } }}
        extra={
          <Space>
            {!isEditing ? (
              <Button onClick={() => {
                setIsEditing(true);
                editForm.setFieldsValue({
                  fullName: selectedUser?.fullName,
                  account: selectedUser?.account,
                  status: selectedUser?.status === 'Активный',
                  companyId: selectedUser?.companyId,
                  roleId: selectedUser?.roleId,
                });
              }}>
                Изменить
              </Button>
            ) : (
              <>
                <Button onClick={() => {
                  setIsEditing(false);
                  editForm.resetFields();
                }}>
                  Отмена
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => editForm.submit()}
                  loading={saving}
                >
                  Сохранить
                </Button>
              </>
            )}
            {selectedUser && !selectedUser.isSuperAdmin && !isEditing && (
              <Popconfirm
                title="Удалить пользователя?"
                description={`Вы уверены, что хотите удалить ${selectedUser.fullName}?`}
                onConfirm={() => {
                  handleDeleteUser(selectedUser.id);
                  setDrawerOpen(false);
                }}
                okText="Удалить"
                okType="danger"
                cancelText="Отмена"
              >
                <Button danger icon={<DeleteOutlined />}>
                  Удалить
                </Button>
              </Popconfirm>
            )}
            {!isEditing && (
              <Button icon={<MoreOutlined />}>Еще</Button>
            )}
          </Space>
        }
      >
        {selectedUser && (
          <>
            {isEditing ? (
              <Form
                form={editForm}
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="right"
                colon={false}
                size="large"
                style={{ width: 500, margin: '0 auto' }}
                onFinish={handleUpdateUser}
              >
                <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>Основные данные</Title>
                
                <Form.Item name="status" label="Статус" valuePropName="checked">
                  <Switch />
                </Form.Item>
                
                <Form.Item name="fullName" label="ФИО">
                  <Input placeholder="Введите текст" />
                </Form.Item>
                
                <Form.Item name="account" label="Аккаунт">
                  <Input placeholder="Введите текст" />
                </Form.Item>

                {/* Доступ */}
                <Typography.Text strong style={{ marginBottom: 16, marginTop: 24, display: 'block', textAlign: 'center' }}>
                  Доступ
                </Typography.Text>

                <Form.Item name="companyId" label="Компания">
                  <Select placeholder="Выберите из списка" allowClear>
                    {companies.map(company => (
                      <Select.Option key={company.id} value={company.id}>
                        {company.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item name="roleId" label="Роль">
                  <Select placeholder="Выберите из списка" allowClear>
                    {roles.map(role => (
                      <Select.Option key={role.id} value={role.id}>
                        {role.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            ) : (
              <Flex vertical gap={24}>
                {/* Основные данные */}
                <div>
                  <Title level={4} style={{ marginBottom: 16 }}>Основные данные</Title>
                  
                  <Flex vertical gap={16}>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        ФИО
                      </Typography.Text>
                      <Typography.Text>{selectedUser.fullName}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Аккаунт
                      </Typography.Text>
                      <Typography.Text>{selectedUser.account}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Компания
                      </Typography.Text>
                      <Typography.Text>{selectedUser.company}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Роль
                      </Typography.Text>
                      <Typography.Text>{selectedUser.role}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Статус
                      </Typography.Text>
                      <Badge 
                        status={selectedUser.status === 'Активный' ? 'success' : 'warning'} 
                        text={
                          <span style={{ color: selectedUser.status === 'Активный' ? '#52c41a' : '#faad14' }}>
                            {selectedUser.status}
                          </span>
                        } 
                      />
                    </div>
                    {selectedUser.isSuperAdmin && (
                      <div>
                        <Tag color="gold">Суперадмин</Tag>
                      </div>
                    )}
                  </Flex>
                </div>

                <Divider />

                {/* Системные данные */}
                <div>
                  <Title level={4} style={{ marginBottom: 16 }}>Системные данные</Title>
                  <Flex vertical gap={12}>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Дата создания
                      </Typography.Text>
                      <Typography.Text>{formatDate(selectedUser.createdAt)}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Последнее обновление
                      </Typography.Text>
                      <Typography.Text>{formatDate(selectedUser.updatedAt)}</Typography.Text>
                    </div>
                  </Flex>
                </div>
              </Flex>
            )}
          </>
        )}
      </Drawer>

      {/* Drawer для добавления пользователя */}
      <Drawer
        title="Добавить пользователя"
        placement="right"
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        size="large"
        styles={{ wrapper: { width: 860 } }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="right"
          colon={false}
          size="large"
          style={{ width: 500, margin: '0 auto' }}
          onFinish={handleCreateUser}
        >
          <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>Основные данные</Title>
          
          <Form.Item name="status" label="Статус" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          
          <Form.Item name="fullName" label="ФИО">
            <Input placeholder="Введите текст" />
          </Form.Item>
          
          <Form.Item name="account" label="Аккаунт">
            <Input placeholder="Введите текст" />
          </Form.Item>

          {/* Доступ */}
          <Typography.Text strong style={{ marginBottom: 16, marginTop: 24, display: 'block', textAlign: 'center' }}>
            Доступ
          </Typography.Text>

          <Form.Item name="companyId" label="Компания">
            <Select placeholder="Выберите из списка" allowClear>
              {companies.map(company => (
                <Select.Option key={company.id} value={company.id}>
                  {company.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="roleId" label="Роль">
            <Select placeholder="Выберите из списка" allowClear>
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Кнопка сохранить */}
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center', marginTop: 24 }}>
            <Button color="default" variant="solid" icon={<CheckOutlined />} htmlType="submit" loading={saving}>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Flex>
  );
}
