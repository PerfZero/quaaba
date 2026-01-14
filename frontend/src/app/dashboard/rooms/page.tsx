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

interface Room {
  key: string;
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function RoomsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeFilter, setActiveFilter] = useState<string>("Активные");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/rooms`);
      const result = await response.json();
      if (result.data) {
        setRooms(result.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      message.error("Ошибка при загрузке комнат");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRooms();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCreateRoom = async (values: { name: string; status: boolean }) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Комната успешно создана");
        setAddDrawerOpen(false);
        form.resetFields();
        fetchRooms();
      } else {
        message.error(result.message || "Ошибка при создании комнаты");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      message.error("Ошибка при создании комнаты");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRoom = async (values: { name: string; status: boolean }) => {
    if (!selectedRoom) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/rooms/${selectedRoom.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Комната успешно обновлена");
        setIsEditing(false);

        const roomResponse = await fetch(`${API_URL}/rooms/${selectedRoom.id}`);
        const roomResult = await roomResponse.json();
        if (roomResult.data) {
          const formattedRoom = {
            key: roomResult.data.id.toString(),
            id: roomResult.data.id,
            name: roomResult.data.name,
            status:
              roomResult.data.status === "active"
                ? "Активный"
                : "Неактивный",
            createdAt: roomResult.data.createdAt,
            updatedAt: roomResult.data.updatedAt,
          };
          setSelectedRoom(formattedRoom);
        }

        fetchRooms();
      } else {
        message.error(result.message || "Ошибка при обновлении комнаты");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      message.error("Ошибка при обновлении комнаты");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    try {
      const response = await fetch(`${API_URL}/rooms/${roomId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Комната успешно удалена");
        fetchRooms();
        if (selectedRoom?.id === roomId) {
          setDrawerOpen(false);
          setSelectedRoom(null);
          setIsEditing(false);
        }
      } else {
        message.error(result.message || "Ошибка при удалении комнаты");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      message.error("Ошибка при удалении комнаты");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Выберите комнаты для удаления");
      return;
    }

    Modal.confirm({
      title: "Удалить выбранные комнаты?",
      content: `Вы уверены, что хотите удалить ${selectedRowKeys.length} элементов?`,
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map((key) =>
            fetch(`${API_URL}/rooms/${key}`, { method: "DELETE" }),
          );
          await Promise.all(deletePromises);
          message.success(`Удалено элементов: ${selectedRowKeys.length}`);
          setSelectedRowKeys([]);
          fetchRooms();
        } catch (error) {
          console.error("Error deleting rooms:", error);
          message.error("Ошибка при удалении комнат");
        }
      },
    });
  };

  const columns: ColumnsType<Room> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
            title="Удалить комнату?"
            description={`Вы уверены, что хотите удалить ${record.name}?`}
            onConfirm={() => handleDeleteRoom(record.id)}
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

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === "Активные") {
      return room.status === "Активный";
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
            Комнаты
          </Title>
          <Tag>{rooms.length}</Tag>
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
              title="Удалить выбранные комнаты?"
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
          dataSource={filteredRooms}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRoom(record);
              setIsEditing(false);
              editForm.resetFields();
              setDrawerOpen(true);
            },
            style: { cursor: "pointer" },
          })}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredRooms.length,
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
        title={selectedRoom ? selectedRoom.name : ""}
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
                    name: selectedRoom?.name,
                    status: selectedRoom?.status === "Активный",
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
                title="Удалить комнату?"
                description={`Вы уверены, что хотите удалить ${selectedRoom?.name}?`}
                onConfirm={() => {
                  if (selectedRoom) {
                    handleDeleteRoom(selectedRoom.id);
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
        {selectedRoom && (
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
                onFinish={handleUpdateRoom}
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
                      <Typography.Text>{selectedRoom.name}</Typography.Text>
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
                          selectedRoom.status === "Активный"
                            ? "success"
                            : "warning"
                        }
                        text={
                          <span
                            style={{
                              color:
                                selectedRoom.status === "Активный"
                                  ? "#52c41a"
                                  : "#faad14",
                            }}
                          >
                            {selectedRoom.status}
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
                        {formatDate(selectedRoom.createdAt)}
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
                        {formatDate(selectedRoom.updatedAt)}
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
        title="Добавить комнату"
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
          onFinish={handleCreateRoom}
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
