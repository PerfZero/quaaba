"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Flex,
  Input,
  Button,
  Space,
  Tag,
  Segmented,
  Table,
  Badge,
  Drawer,
  Divider,
  Form,
  Switch,
  message,
  Spin,
  Modal,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  CloudUploadOutlined,
  MoreOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface ExtraService {
  key: string;
  id: number;
  name: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExtraServicesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeFilter, setActiveFilter] = useState<string>("Активные");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ExtraService | null>(
    null,
  );
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [services, setServices] = useState<ExtraService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/extra-services`);
      const result = await response.json();
      if (result.data) {
        setServices(result.data);
      }
    } catch (error) {
      console.error("Error fetching extra services:", error);
      message.error("Ошибка при загрузке доп. услуг");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchServices();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCreateService = async (values: {
    name: string;
    code: string;
    status: boolean;
  }) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/extra-services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Доп. услуга успешно создана");
        setAddDrawerOpen(false);
        form.resetFields();
        fetchServices();
      } else {
        message.error(result.message || "Ошибка при создании доп. услуги");
      }
    } catch (error) {
      console.error("Error creating extra service:", error);
      message.error("Ошибка при создании доп. услуги");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateService = async (values: {
    name: string;
    code: string;
    status: boolean;
  }) => {
    if (!selectedService) return;

    setSaving(true);
    try {
      const response = await fetch(
        `${API_URL}/extra-services/${selectedService.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const result = await response.json();

      if (response.ok) {
        message.success("Доп. услуга успешно обновлена");
        setIsEditing(false);

        const serviceResponse = await fetch(
          `${API_URL}/extra-services/${selectedService.id}`,
        );
        const serviceResult = await serviceResponse.json();
        if (serviceResult.data) {
          const formattedService = {
            key: serviceResult.data.id.toString(),
            id: serviceResult.data.id,
            name: serviceResult.data.name,
            code: serviceResult.data.code,
            status:
              serviceResult.data.status === "active"
                ? "Активный"
                : "Неактивный",
            createdAt: serviceResult.data.createdAt,
            updatedAt: serviceResult.data.updatedAt,
          };
          setSelectedService(formattedService);
        }

        fetchServices();
      } else {
        message.error(result.message || "Ошибка при обновлении доп. услуги");
      }
    } catch (error) {
      console.error("Error updating extra service:", error);
      message.error("Ошибка при обновлении доп. услуги");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    try {
      const response = await fetch(`${API_URL}/extra-services/${serviceId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Доп. услуга успешно удалена");
        fetchServices();
        if (selectedService?.id === serviceId) {
          setDrawerOpen(false);
          setSelectedService(null);
          setIsEditing(false);
        }
      } else {
        message.error(result.message || "Ошибка при удалении доп. услуги");
      }
    } catch (error) {
      console.error("Error deleting extra service:", error);
      message.error("Ошибка при удалении доп. услуги");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Выберите доп. услуги для удаления");
      return;
    }

    Modal.confirm({
      title: "Удалить выбранные доп. услуги?",
      content: `Вы уверены, что хотите удалить ${selectedRowKeys.length} элементов?`,
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map((key) =>
            fetch(`${API_URL}/extra-services/${key}`, { method: "DELETE" }),
          );
          await Promise.all(deletePromises);
          message.success(`Удалено элементов: ${selectedRowKeys.length}`);
          setSelectedRowKeys([]);
          fetchServices();
        } catch (error) {
          console.error("Error deleting extra services:", error);
          message.error("Ошибка при удалении доп. услуг");
        }
      },
    });
  };

  const columns: ColumnsType<ExtraService> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Код",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Badge
          status={status === "Активный" ? "success" : "warning"}
          text={
            <span
              style={{
                color: status === "Активный" ? "#52c41a" : "#faad14",
              }}
            >
              {status}
            </span>
          }
        />
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Удалить доп. услугу?"
            description={`Вы уверены, что хотите удалить ${record.name}?`}
            onConfirm={() => handleDeleteService(record.id)}
            okText="Удалить"
            okType="danger"
            cancelText="Отмена"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredServices = services.filter((service) => {
    if (activeFilter === "Активные") {
      return service.status === "Активный";
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <Flex align="center" gap={12}>
          <Title level={2} style={{ margin: 0 }}>
            Доп. услуги
          </Title>
          <Tag>{services.length}</Tag>
        </Flex>
        <Search placeholder="Поиск по названию" allowClear style={{ width: 400 }} />
        <Flex gap={12} align="center">
          <Space>
            <Tag
              color={activeFilter === "Активные" ? "blue" : "default"}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveFilter("Активные")}
            >
              Активные
            </Tag>
            <Tag
              color={activeFilter === "Все" ? "blue" : "default"}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveFilter("Все")}
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
              title="Удалить выбранные доп. услуги?"
              description={`Вы уверены, что хотите удалить ${selectedRowKeys.length} элементов?`}
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
            { label: <UnorderedListOutlined />, value: "list" },
            { label: <AppstoreOutlined />, value: "grid" },
          ]}
          value={viewMode}
          onChange={(value) => setViewMode(value as "list" | "grid")}
        />
      </Flex>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredServices}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedService(record);
              setIsEditing(false);
              editForm.resetFields();
              setDrawerOpen(true);
            },
            style: { cursor: "pointer" },
          })}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredServices.length,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
            pageSizeOptions: ["10", "20", "50", "100"],
            locale: { items_per_page: "/ стр" },
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            onShowSizeChange: () => {
              setCurrentPage(1);
            },
          }}
        />
      </Spin>

      <Drawer
        title={selectedService ? selectedService.name : ""}
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
              <Button
                onClick={() => {
                  setIsEditing(true);
                  editForm.setFieldsValue({
                    name: selectedService?.name,
                    code: selectedService?.code,
                    status: selectedService?.status === "Активный",
                  });
                }}
              >
                Изменить
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    editForm.resetFields();
                  }}
                >
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
                title="Удалить доп. услугу?"
                description={`Вы уверены, что хотите удалить ${selectedService?.name}?`}
                onConfirm={() => {
                  if (selectedService) {
                    handleDeleteService(selectedService.id);
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
            {!isEditing && <Button icon={<MoreOutlined />}>Еще</Button>}
          </Space>
        }
      >
        {selectedService && (
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
                style={{ width: 500, margin: "0 auto" }}
                onFinish={handleUpdateService}
              >
                <Title
                  level={4}
                  style={{ marginBottom: 24, textAlign: "center" }}
                >
                  Основные данные
                </Title>

                <Form.Item name="status" label="Статус" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Form.Item name="name" label="Наименование">
                  <Input placeholder="Введите текст" />
                </Form.Item>

                <Form.Item name="code" label="Код">
                  <Input placeholder="Введите код" />
                </Form.Item>
              </Form>
            ) : (
              <Flex vertical gap={24}>
                <div>
                  <Title level={4} style={{ marginBottom: 16 }}>
                    Основные данные
                  </Title>

                  <Flex vertical gap={16}>
                    <div>
                      <Typography.Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Наименование
                      </Typography.Text>
                      <Typography.Text>{selectedService.name}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Код
                      </Typography.Text>
                      <Typography.Text>{selectedService.code}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Статус
                      </Typography.Text>
                      <Badge
                        status={
                          selectedService.status === "Активный"
                            ? "success"
                            : "warning"
                        }
                        text={
                          <span
                            style={{
                              color:
                                selectedService.status === "Активный"
                                  ? "#52c41a"
                                  : "#faad14",
                            }}
                          >
                            {selectedService.status}
                          </span>
                        }
                      />
                    </div>
                  </Flex>
                </div>

                <Divider />

                <div>
                  <Title level={4} style={{ marginBottom: 16 }}>
                    Системные данные
                  </Title>
                  <Flex vertical gap={12}>
                    <div>
                      <Typography.Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Дата создания
                      </Typography.Text>
                      <Typography.Text>
                        {formatDate(selectedService.createdAt)}
                      </Typography.Text>
                    </div>
                    <div>
                      <Typography.Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Последнее обновление
                      </Typography.Text>
                      <Typography.Text>
                        {formatDate(selectedService.updatedAt)}
                      </Typography.Text>
                    </div>
                  </Flex>
                </div>
              </Flex>
            )}
          </>
        )}
      </Drawer>

      <Drawer
        title="Добавить доп. услугу"
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
          style={{ width: 500, margin: "0 auto" }}
          onFinish={handleCreateService}
        >
          <Title level={4} style={{ marginBottom: 24, textAlign: "center" }}>
            Основные данные
          </Title>

          <Form.Item
            name="status"
            label="Статус"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item name="name" label="Наименование">
            <Input placeholder="Введите текст" />
          </Form.Item>

          <Form.Item name="code" label="Код">
            <Input placeholder="Введите код" />
          </Form.Item>

          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ textAlign: "center", marginTop: 24 }}
          >
            <Button
              color="default"
              variant="solid"
              icon={<CheckOutlined />}
              htmlType="submit"
              loading={saving}
            >
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Flex>
  );
}
