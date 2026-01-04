'use client';

import { useState } from 'react';
import { Typography, Flex, Input, Button, Space, Tag, Segmented, Table, Drawer, Divider, Form, Select, DatePicker, InputNumber, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  PlusOutlined, 
  CloudUploadOutlined, 
  MoreOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  CheckOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Search, TextArea } = Input;

interface Company {
  key: string;
  name: string;
  inn: string;
  tariff: string;
  tourCode: string;
  signedEcsp: string;
  registrationDate: string;
}

export default function CompaniesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<string>('Активные');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<Company> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'ИИН/БИН',
      dataIndex: 'inn',
      key: 'inn',
      sorter: (a, b) => a.inn.localeCompare(b.inn),
    },
    {
      title: 'Тариф',
      dataIndex: 'tariff',
      key: 'tariff',
      sorter: (a, b) => a.tariff.localeCompare(b.tariff),
    },
    {
      title: 'Туркод',
      dataIndex: 'tourCode',
      key: 'tourCode',
      sorter: (a, b) => a.tourCode.localeCompare(b.tourCode),
    },
    {
      title: 'Подписан ЭЦП',
      dataIndex: 'signedEcsp',
      key: 'signedEcsp',
      sorter: (a, b) => a.signedEcsp.localeCompare(b.signedEcsp),
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      sorter: (a, b) => a.registrationDate.localeCompare(b.registrationDate),
    },
  ];

  const data: Company[] = [
    {
      key: '1',
      name: 'ТОО ABBA',
      inn: '930718300600',
      tariff: 'Standard',
      tourCode: 'VSJ123',
      signedEcsp: '01.01.2025',
      registrationDate: '01.01.2025',
    },
    {
      key: '2',
      name: 'ИП XYZ',
      inn: '930718300600',
      tariff: 'Deluxe',
      tourCode: 'VSJ123',
      signedEcsp: '01.01.2025',
      registrationDate: '01.01.2025',
    },
    {
      key: '3',
      name: 'ТОО ABBA',
      inn: '930718300600',
      tariff: 'Premium',
      tourCode: 'VSJ123',
      signedEcsp: '-',
      registrationDate: '01.01.2025',
    },
    {
      key: '4',
      name: 'ТОО ABBA',
      inn: '930718300600',
      tariff: 'Standard',
      tourCode: 'VSJ123',
      signedEcsp: '-',
      registrationDate: '01.01.2025',
    },
    {
      key: '5',
      name: 'ТОО ABBA',
      inn: '930718300600',
      tariff: 'Standard',
      tourCode: 'VSJ123',
      signedEcsp: '01.01.2025',
      registrationDate: '01.01.2025',
    },
    {
      key: '6',
      name: 'ИП XYZ',
      inn: '930718300600',
      tariff: 'Standard',
      tourCode: 'VSJ123',
      signedEcsp: '01.01.2025',
      registrationDate: '01.01.2025',
    },
    {
      key: '7',
      name: 'ИП XYZ',
      inn: '930718300600',
      tariff: 'Standard',
      tourCode: 'VSJ123',
      signedEcsp: '-',
      registrationDate: '01.01.2025',
    },
    {
      key: '8',
      name: 'ИП XYZ',
      inn: '930718300600',
      tariff: 'Standard',
      tourCode: 'VSJ123',
      signedEcsp: '01.01.2025',
      registrationDate: '01.01.2025',
    },
  ];

  return (
    <Flex vertical gap={16}>
      {/* Первая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        {/* Блок 1: Название + количество */}
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>
            Компании
          </Title>
          <Tag>{100}</Tag>
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
              color={activeFilter === 'Вчера' ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter('Вчера')}
            >
              Вчера
            </Tag>
            <Tag 
              color={activeFilter === 'Сегодня' ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveFilter('Сегодня')}
            >
              Сегодня
            </Tag>
          </Space>
          <Button icon={<FilterOutlined />}>
            Фильтры
          </Button>
        </Flex>
      </Flex>

      {/* Вторая строка */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        {/* Блок 1: Выделить */}
        <Button icon={<CheckSquareOutlined />}>
          Выделить
        </Button>

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
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedCompany(record);
            setDrawerOpen(true);
          },
          style: { cursor: 'pointer' },
        })}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: 100,
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

      {/* Drawer с деталями компании */}
      <Drawer
        title={selectedCompany ? `${selectedCompany.name} / ${selectedCompany.inn}` : ''}
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="large"
        styles={{ wrapper: { width: 860 } }}
        extra={
          <Space>
            <Button>Изменить</Button>
            <Button icon={<MoreOutlined />}>Еще</Button>
          </Space>
        }
      >
        {selectedCompany && (
          <Flex vertical gap={24}>
            {/* Основные данные */}
            <div>
              <Title level={4} style={{ marginBottom: 16 }}>Основные данные</Title>
              
              {/* Компания */}
              <div style={{ marginBottom: 16 }}>
                <Typography.Text strong style={{ fontSize: 14, marginBottom: 8, display: 'block' }}>
                  Компания
                </Typography.Text>
                <Flex vertical gap={12}>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Наименование
                    </Typography.Text>
                    <Typography.Text>{selectedCompany.name}</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Форма
                    </Typography.Text>
                    <Typography.Text>ТОО</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      ИИН/БИН
                    </Typography.Text>
                    <Typography.Text>{selectedCompany.inn}</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Адрес
                    </Typography.Text>
                    <Typography.Text>РК, г.Алматы, ул. Халиуллина</Typography.Text>
                  </div>
                </Flex>
              </div>

              {/* Банк.счета */}
              <div style={{ marginBottom: 16 }}>
                <Typography.Text strong style={{ fontSize: 14, marginBottom: 8, display: 'block' }}>
                  Банк.счета
                </Typography.Text>
                <Flex vertical gap={12}>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Основной счет
                    </Typography.Text>
                    <Flex vertical gap={4}>
                      <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>ИИК:</Typography.Text>
                        <Typography.Text style={{ marginLeft: 8 }}>KZ123456789123</Typography.Text>
                      </div>
                      <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>БИК:</Typography.Text>
                        <Typography.Text style={{ marginLeft: 8 }}>CASPKZKA – АО "Kaspi Bank"</Typography.Text>
                      </div>
                    </Flex>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Доп. счет 1
                    </Typography.Text>
                    <Flex vertical gap={4}>
                      <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>ИИК:</Typography.Text>
                        <Typography.Text style={{ marginLeft: 8 }}>KZ123456789123</Typography.Text>
                      </div>
                      <div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>БИК:</Typography.Text>
                        <Typography.Text style={{ marginLeft: 8 }}>CASPKZKA – АО "Kaspi Bank"</Typography.Text>
                      </div>
                    </Flex>
                  </div>
                </Flex>
              </div>

              {/* Верификация */}
              <div style={{ marginBottom: 16 }}>
                <Typography.Text strong style={{ fontSize: 14, marginBottom: 8, display: 'block' }}>
                  Верификация
                </Typography.Text>
                <Flex vertical gap={12}>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Взнос
                    </Typography.Text>
                    <Typography.Text>100 000 KZT от 01.01.2025</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Туркод
                    </Typography.Text>
                    <Typography.Text>VSZ123 от 01.01.2025</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Тариф
                    </Typography.Text>
                    <Typography.Text>{selectedCompany.tariff}</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      ЭЦП
                    </Typography.Text>
                    <Typography.Text>Подписан НУЦ РК 01.01.2025</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      Статус
                    </Typography.Text>
                    <Tag color="green">Активный</Tag>
                  </div>
                </Flex>
              </div>

              {/* Комментарий */}
              <div>
                <Typography.Text strong style={{ fontSize: 14, marginBottom: 8, display: 'block' }}>
                  Комментарий
                </Typography.Text>
                <Typography.Text>От Баке)</Typography.Text>
              </div>
            </div>

            <Divider />

            {/* Пользователи */}
            <div>
              <Title level={4} style={{ marginBottom: 16 }}>Пользователи</Title>
              <Flex vertical gap={16}>
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    1 Пользователь
                  </Typography.Text>
                  <Flex vertical gap={4}>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>ФИО:</Typography.Text>
                      <Typography.Text style={{ marginLeft: 8 }}>Омар Алишер</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>ИИН:</Typography.Text>
                      <Typography.Text style={{ marginLeft: 8 }}>930718300600</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>Роль:</Typography.Text>
                      <Typography.Text style={{ marginLeft: 8 }}>Владелец</Typography.Text>
                    </div>
                  </Flex>
                </div>
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    2 Пользователь
                  </Typography.Text>
                  <Flex vertical gap={4}>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>ФИО:</Typography.Text>
                      <Typography.Text style={{ marginLeft: 8 }}>Орынбек Дулат</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>ИИН:</Typography.Text>
                      <Typography.Text style={{ marginLeft: 8 }}>930718300600</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>Роль:</Typography.Text>
                      <Typography.Text style={{ marginLeft: 8 }}>Менеджер продажи</Typography.Text>
                    </div>
                  </Flex>
                </div>
              </Flex>
            </div>

            <Divider />

            {/* Системные данные */}
            <div>
              <Title level={4} style={{ marginBottom: 16 }}>Системные данные</Title>
              <Typography.Text strong style={{ fontSize: 14, marginBottom: 8, display: 'block' }}>
                Данные
              </Typography.Text>
              <Flex vertical gap={12}>
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    Дата создания
                  </Typography.Text>
                  <Typography.Text>01.01.2025</Typography.Text>
                </div>
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    Автор
                  </Typography.Text>
                  <Typography.Text>Алишер О.</Typography.Text>
                </div>
              </Flex>
            </div>
          </Flex>
        )}
      </Drawer>

      {/* Drawer для добавления компании */}
      <Drawer
        title="Добавить компанию"
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
          onFinish={(values) => {
            console.log('Form values:', values);
            setAddDrawerOpen(false);
          }}
        >
          <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>Основные данные</Title>
          
          <Form.Item name="name" label="Наименование">
            <Input placeholder="Введите текст" defaultValue="ТОО ABBA" />
          </Form.Item>
          
          <Form.Item name="form" label="Форма" initialValue="ИП">
            <Segmented options={['ИП', 'ТОО']} />
          </Form.Item>
          
          <Form.Item name="inn" label="ИИН/БИН">
            <Input placeholder="Введите текст" />
          </Form.Item>
          
          <Form.Item name="address" label="Адрес">
            <Input placeholder="Введите текст" />
          </Form.Item>

          {/* Банк.счета */}
          <Typography.Text strong style={{ marginBottom: 16, marginTop: 24, display: 'block', textAlign: 'center' }}>
            Банк.счета
          </Typography.Text>
          
          <Form.Item label="Основной счет">
            <Flex gap={12}>
              <Input placeholder="Введите цифры" style={{ flex: 1 }} />
              <Select placeholder="Выберите из списка" style={{ flex: 1 }} />
            </Flex>
          </Form.Item>
          
          <Form.Item label="Доп.счет 1">
            <Flex gap={12}>
              <Input placeholder="Введите цифры" style={{ flex: 1 }} />
              <Select placeholder="Выберите из списка" style={{ flex: 1 }} />
            </Flex>
          </Form.Item>
          
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="link" icon={<PlusOutlined />} style={{ padding: 0 }}>
              Добавить
            </Button>
          </Form.Item>

          {/* Верификация */}
          <Typography.Text strong style={{ marginBottom: 16, marginTop: 24, display: 'block', textAlign: 'center' }}>
            Верификация
          </Typography.Text>
          
          <Form.Item label="Взнос">
            <Flex gap={12}>
              <InputNumber placeholder="Введите цифры" style={{ flex: 1 }} />
              <DatePicker placeholder="Выберите дату" style={{ flex: 1 }} />
            </Flex>
          </Form.Item>
          
          <Form.Item label="Туркод">
            <Flex gap={12}>
              <Input placeholder="Введите текст" style={{ flex: 1 }} />
              <DatePicker placeholder="Выберите дату" style={{ flex: 1 }} />
            </Flex>
          </Form.Item>
          
          <Form.Item name="tariff" label="Тариф" initialValue="Econom">
            <Select>
              <Select.Option value="Econom">Econom</Select.Option>
              <Select.Option value="Standard">Standard</Select.Option>
              <Select.Option value="Premium">Premium</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="ЭЦП">
            <Flex vertical gap={8}>
              <Button>Подписать в NCA Layer</Button>
              <Typography.Text type="secondary">Подписан НУЦ РК 01.01.2025</Typography.Text>
            </Flex>
          </Form.Item>
          
          <Form.Item name="active" label="Активный" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          {/* Комментарий */}
          <Typography.Text strong style={{ marginBottom: 16, marginTop: 24, display: 'block', textAlign: 'center' }}>
            Комментарий
          </Typography.Text>
          
          <Form.Item name="comment" wrapperCol={{ span: 24 }}>
            <TextArea placeholder="Введите текст" rows={4} />
          </Form.Item>

          {/* Кнопка сохранить */}
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center', marginTop: 24 }}>
            <Button color="default" variant="solid" icon={<CheckOutlined />} htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Flex>
  );
}
    