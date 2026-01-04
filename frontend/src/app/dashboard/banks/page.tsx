'use client';

import { useState, useEffect } from 'react';
import { Typography, Flex, Input, Button, Space, Tag, Segmented, Table, Badge, Drawer, Divider, Form, Switch, message, Spin, Modal, Popconfirm } from 'antd';
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

interface Bank {
  key: string;
  id: number;
  name: string;
  bic: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BanksPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // Data states
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch banks
  const fetchBanks = async () => {
    try {
      const response = await fetch(`${API_URL}/banks`);
      const result = await response.json();
      if (result.data) {
        setBanks(result.data);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      message.error('Ошибка при загрузке банков');
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchBanks();
      setLoading(false);
    };
    loadData();
  }, []);

  // Create bank
  const handleCreateBank = async (values: { name: string; bic: string; status: boolean }) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/banks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        message.success('Банк успешно создан');
        setAddDrawerOpen(false);
        form.resetFields();
        fetchBanks();
      } else {
        message.error(result.message || 'Ошибка при создании банка');
      }
    } catch (error) {
      console.error('Error creating bank:', error);
      message.error('Ошибка при создании банка');
    } finally {
      setSaving(false);
    }
  };

  // Update bank
  const handleUpdateBank = async (values: { name: string; bic: string; status: boolean }) => {
    if (!selectedBank) return;
    
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/banks/${selectedBank.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        message.success('Банк успешно обновлен');
        setIsEditing(false);
        
        // Обновляем данные банка
        const bankResponse = await fetch(`${API_URL}/banks/${selectedBank.id}`);
        const bankResult = await bankResponse.json();
        if (bankResult.data) {
          const formattedBank = {
            key: bankResult.data.id.toString(),
            id: bankResult.data.id,
            name: bankResult.data.name,
            bic: bankResult.data.bic,
            status: bankResult.data.status === 'active' ? 'Активный' : 'Неактивный',
            createdAt: bankResult.data.createdAt,
            updatedAt: bankResult.data.updatedAt,
          };
          setSelectedBank(formattedBank);
        }
        
        fetchBanks();
      } else {
        message.error(result.message || 'Ошибка при обновлении банка');
      }
    } catch (error) {
      console.error('Error updating bank:', error);
      message.error('Ошибка при обновлении банка');
    } finally {
      setSaving(false);
    }
  };

  // Delete bank
  const handleDeleteBank = async (bankId: number) => {
    try {
      const response = await fetch(`${API_URL}/banks/${bankId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        message.success('Банк успешно удален');
        fetchBanks();
        if (selectedBank?.id === bankId) {
          setDrawerOpen(false);
          setSelectedBank(null);
          setIsEditing(false);
        }
      } else {
        message.error(result.message || 'Ошибка при удалении банка');
      }
    } catch (error) {
      console.error('Error deleting bank:', error);
      message.error('Ошибка при удалении банка');
    }
  };

  // Delete selected banks
  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Выберите банки для удаления');
      return;
    }

    Modal.confirm({
      title: 'Удалить выбранные банки?',
      content: `Вы уверены, что хотите удалить ${selectedRowKeys.length} банков?`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map(key => 
            fetch(`${API_URL}/banks/${key}`, { method: 'DELETE' })
          );
          await Promise.all(deletePromises);
          message.success(`Удалено банков: ${selectedRowKeys.length}`);
          setSelectedRowKeys([]);
          fetchBanks();
        } catch (error) {
          console.error('Error deleting banks:', error);
          message.error('Ошибка при удалении банков');
        }
      },
    });
  };

  const columns: ColumnsType<Bank> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'БИК',
      dataIndex: 'bic',
      key: 'bic',
      sorter: (a, b) => a.bic.localeCompare(b.bic),
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
        <div onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Удалить банк?"
            description={`Вы уверены, что хотите удалить ${record.name}?`}
            onConfirm={() => handleDeleteBank(record.id)}
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
      ),
    },
  ];

  // Filter banks based on active filter
  const filteredBanks = banks.filter(bank => {
    if (activeFilter === 'Активные') {
      return bank.status === 'Активный';
    }
    return true;
  });

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
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>Банки</Title>
          <Tag>{banks.length}</Tag>
        </Flex>
        <Search placeholder="Поиск по названию" allowClear style={{ width: 400 }} />
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
          <Button icon={<FilterOutlined />}>Фильтры</Button>
        </Flex>
      </Flex>
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Flex gap={12} align="center">
          <Button icon={<CheckSquareOutlined />}>Выделить</Button>
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title="Удалить выбранные банки?"
              description={`Вы уверены, что хотите удалить ${selectedRowKeys.length} банков?`}
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
        <Flex gap={12} align="center">
          <Button icon={<PlusOutlined />} onClick={() => setAddDrawerOpen(true)}>
            Добавить
          </Button>
          <Button icon={<CloudUploadOutlined />}>Загрузить</Button>
          <Button icon={<MoreOutlined />}>Еще</Button>
        </Flex>
        <Segmented 
          options={[
            { label: <UnorderedListOutlined />, value: 'list' }, 
            { label: <AppstoreOutlined />, value: 'grid' }
          ]} 
          value={viewMode} 
          onChange={(value) => setViewMode(value as 'list' | 'grid')} 
        />
      </Flex>
      <Spin spinning={loading}>
        <Table 
          columns={columns} 
          dataSource={filteredBanks} 
          rowSelection={{ 
            selectedRowKeys, 
            onChange: setSelectedRowKeys 
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedBank(record);
              setIsEditing(false);
              editForm.resetFields();
              setDrawerOpen(true);
            },
            style: { cursor: 'pointer' },
          })}
          pagination={{ 
            current: currentPage, 
            pageSize, 
            total: filteredBanks.length, 
            showSizeChanger: true, 
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`, 
            pageSizeOptions: ['10', '20', '50', '100'], 
            locale: { items_per_page: '/ стр' }, 
            onChange: (page, size) => { 
              setCurrentPage(page); 
              setPageSize(size); 
            }, 
            onShowSizeChange: (current, size) => { 
              setCurrentPage(1); 
              setPageSize(size); 
            } 
          }} 
        />
      </Spin>

      {/* Drawer с деталями банка */}
      <Drawer
        title={selectedBank ? `${selectedBank.name} / ${selectedBank.bic}` : ''}
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
                  name: selectedBank?.name,
                  bic: selectedBank?.bic,
                  status: selectedBank?.status === 'Активный',
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
            {!isEditing && (
              <Popconfirm
                title="Удалить банк?"
                description={`Вы уверены, что хотите удалить ${selectedBank?.name}?`}
                onConfirm={() => {
                  if (selectedBank) {
                    handleDeleteBank(selectedBank.id);
                    setDrawerOpen(false);
                  }
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
        {selectedBank && (
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
                onFinish={handleUpdateBank}
              >
                <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>Основные данные</Title>
                
                <Form.Item name="status" label="Статус" valuePropName="checked">
                  <Switch />
                </Form.Item>
                
                <Form.Item name="name" label="Наименование">
                  <Input placeholder="Введите текст" />
                </Form.Item>
                
                <Form.Item name="bic" label="БИК">
                  <Input placeholder="Введите текст" />
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
                        Наименование
                      </Typography.Text>
                      <Typography.Text>{selectedBank.name}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        БИК
                      </Typography.Text>
                      <Typography.Text>{selectedBank.bic}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Статус
                      </Typography.Text>
                      <Badge 
                        status={selectedBank.status === 'Активный' ? 'success' : 'warning'} 
                        text={
                          <span style={{ color: selectedBank.status === 'Активный' ? '#52c41a' : '#faad14' }}>
                            {selectedBank.status}
                          </span>
                        } 
                      />
                    </div>
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
                      <Typography.Text>{formatDate(selectedBank.createdAt)}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Последнее обновление
                      </Typography.Text>
                      <Typography.Text>{formatDate(selectedBank.updatedAt)}</Typography.Text>
                    </div>
                  </Flex>
                </div>
              </Flex>
            )}
          </>
        )}
      </Drawer>

      {/* Drawer для добавления банка */}
      <Drawer
        title="Добавить банк"
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
          onFinish={handleCreateBank}
        >
          <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>Основные данные</Title>
          
          <Form.Item name="status" label="Статус" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          
          <Form.Item name="name" label="Наименование">
            <Input placeholder="Введите текст" />
          </Form.Item>
          
          <Form.Item name="bic" label="БИК">
            <Input placeholder="Введите текст" />
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
