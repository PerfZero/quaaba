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

interface Airline {
  key: string;
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AirlinesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeFilter, setActiveFilter] = useState<string>("Активные");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Data states
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch airlines
  const fetchAirlines = async () => {
    try {
      const response = await fetch(`${API_URL}/airlines`);
      const result = await response.json();
      if (result.data) {
        setAirlines(result.data);
      }
    } catch (error) {
      console.error("Error fetching airlines:", error);
      message.error("Ошибка при загрузке авиакомпаний");
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAirlines();
      setLoading(false);
    };
    loadData();
  }, []);

  // Create airline
  const handleCreateAirline = async (values: {
    name: string;
    description: string;
    status: boolean;
  }) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/airlines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Авиакомпания успешно создана");
        setAddDrawerOpen(false);
        form.resetFields();
        fetchAirlines();
      } else {
        message.error(result.message || "Ошибка при создании авиакомпании");
      }
    } catch (error) {
      console.error("Error creating airline:", error);
      message.error("Ошибка при создании авиакомпании");
    } finally {
      setSaving(false);
    }
  };

  // Update airline
  const handleUpdateAirline = async (values: {
    name: string;
    description: string;
    status: boolean;
  }) => {
    if (!selectedAirline) return;

    setSaving(true);
    try {
      const response = await fetch(
        `${API_URL}/airlines/${selectedAirline.id}`,
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
        message.success("Авиакомпания успешно обновлена");
        setIsEditing(false);

        const airlineResponse = await fetch(
          `${API_URL}/airlines/${selectedAirline.id}`,
        );
        const airlineResult = await airlineResponse.json();
        if (airlineResult.data) {
          const formattedAirline = {
            key: airlineResult.data.id.toString(),
            id: airlineResult.data.id,
            name: airlineResult.data.name,
            description: airlineResult.data.description || "",
            status:
              airlineResult.data.status === "active"
                ? "Активный"
                : "Неактивный",
            createdAt: airlineResult.data.createdAt,
            updatedAt: airlineResult.data.updatedAt,
          };
          setSelectedAirline(formattedAirline);
        }

        fetchAirlines();
      } else {
        message.error(result.message || "Ошибка при обновлении авиакомпании");
      }
    } catch (error) {
      console.error("Error updating airline:", error);
      message.error("Ошибка при обновлении авиакомпании");
    } finally {
      setSaving(false);
    }
  };

  // Delete airline
  const handleDeleteAirline = async (airlineId: number) => {
    try {
      const response = await fetch(`${API_URL}/airlines/${airlineId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Авиакомпания успешно удалена");
        fetchAirlines();
        if (selectedAirline?.id === airlineId) {
          setDrawerOpen(false);
          setSelectedAirline(null);
          setIsEditing(false);
        }
      } else {
        message.error(result.message || "Ошибка при удалении авиакомпании");
      }
    } catch (error) {
      console.error("Error deleting airline:", error);
      message.error("Ошибка при удалении авиакомпании");
    }
  };

  // Delete selected airlines
  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Выберите авиакомпании для удаления");
      return;
    }

    Modal.confirm({
      title: "Удалить выбранные авиакомпании?",
      content: `Вы уверены, что хотите удалить ${selectedRowKeys.length} авиакомпаний?`,
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map((key) =>
            fetch(`${API_URL}/airlines/${key}`, { method: "DELETE" }),
          );
          await Promise.all(deletePromises);
          message.success(`Удалено авиакомпаний: ${selectedRowKeys.length}`);
          setSelectedRowKeys([]);
          fetchAirlines();
        } catch (error) {
          console.error("Error deleting airlines:", error);
          message.error("Ошибка при удалении авиакомпаний");
        }
      },
    });
  };

  const columns: ColumnsType<Airline> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
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
            title="Удалить авиакомпанию?"
            description={`Вы уверены, что хотите удалить ${record.name}?`}
            onConfirm={() => handleDeleteAirline(record.id)}
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

  const filteredAirlines = airlines.filter((airline) => {
    if (activeFilter === "Активные") {
      return airline.status === "Активный";
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
            Авиакомпании
          </Title>
          <Tag>{airlines.length}</Tag>
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
              title="Удалить выбранные авиакомпании?"
              description={`Вы уверены, что хотите удалить ${selectedRowKeys.length} авиакомпаний?`}
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
          dataSource={filteredAirlines}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedAirline(record);
              setIsEditing(false);
              editForm.resetFields();
              setDrawerOpen(true);
            },
            style: { cursor: "pointer" },
          })}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredAirlines.length,
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
        title={selectedAirline ? selectedAirline.name : ""}
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
                    name: selectedAirline?.name,
                    description: selectedAirline?.description,
                    status: selectedAirline?.status === "Активный",
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
                title="Удалить авиакомпанию?"
                description={`Вы уверены, что хотите удалить ${selectedAirline?.name}?`}
                onConfirm={() => {
                  if (selectedAirline) {
                    handleDeleteAirline(selectedAirline.id);
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
        {selectedAirline && (
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
                onFinish={handleUpdateAirline}
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

                <Form.Item name="description" label="Описание">
                  <Input placeholder="Введите текст" />
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
                      <Typography.Text>{selectedAirline.name}</Typography.Text>
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
                        Описание
                      </Typography.Text>
                      <Typography.Text>
                        {selectedAirline.description || "-"}
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
                        Статус
                      </Typography.Text>
                      <Badge
                        status={
                          selectedAirline.status === "Активный"
                            ? "success"
                            : "warning"
                        }
                        text={
                          <span
                            style={{
                              color:
                                selectedAirline.status === "Активный"
                                  ? "#52c41a"
                                  : "#faad14",
                            }}
                          >
                            {selectedAirline.status}
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
                        {formatDate(selectedAirline.createdAt)}
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
                        {formatDate(selectedAirline.updatedAt)}
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
        title="Добавить авиакомпанию"
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
          onFinish={handleCreateAirline}
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

          <Form.Item name="description" label="Описание">
            <Input placeholder="Введите текст" />
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
