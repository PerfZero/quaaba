"use client";

import { useState, useEffect, useRef } from "react";
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
  AutoComplete,
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

interface City {
  key: string;
  id: number;
  name: string;
  short: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function CitiesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeFilter, setActiveFilter] = useState<string>("Активные");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Data states
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch cities
  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_URL}/cities`);
      const result = await response.json();
      if (result.data) {
        setCities(result.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      message.error("Ошибка при загрузке городов");
    }
  };

  const loadCitySuggestions = async (value: string) => {
    setCitySearchLoading(true);
    try {
      const response = await fetch(`${API_URL}/dadata/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: value }),
      });

      const result = await response.json();
      const options = (result.data || []).map(
        (item: {
          value: string;
          data?: { country_iso_code?: string; country?: string };
        }) => {
          const countryCode = item.data?.country_iso_code || "";
          const countryName = item.data?.country || countryCode || "—";
          return {
            value: `${item.value}::${countryCode || countryName}`,
            label: `${item.value} (${countryName})`,
          };
        },
      );
      setCityOptions(options);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setCityOptions([]);
    } finally {
      setCitySearchLoading(false);
    }
  };

  const handleCitySearch = (value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value || value.trim().length < 2) {
      setCityOptions([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadCitySuggestions(value.trim());
    }, 300);
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCities();
      setLoading(false);
    };
    loadData();
  }, []);

  // Create city
  const handleCreateCity = async (values: {
    name: string;
    short: string;
    status: boolean;
  }) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Город успешно создан");
        setAddDrawerOpen(false);
        form.resetFields();
        fetchCities();
      } else {
        message.error(result.message || "Ошибка при создании города");
      }
    } catch (error) {
      console.error("Error creating city:", error);
      message.error("Ошибка при создании города");
    } finally {
      setSaving(false);
    }
  };

  // Update city
  const handleUpdateCity = async (values: {
    name: string;
    short: string;
    status: boolean;
  }) => {
    if (!selectedCity) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/cities/${selectedCity.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Город успешно обновлен");
        setIsEditing(false);

        // Обновляем данные города
        const cityResponse = await fetch(
          `${API_URL}/cities/${selectedCity.id}`,
        );
        const cityResult = await cityResponse.json();
        if (cityResult.data) {
          const formattedCity = {
            key: cityResult.data.id.toString(),
            id: cityResult.data.id,
            name: cityResult.data.name,
            short: cityResult.data.short,
            status:
              cityResult.data.status === "active" ? "Активный" : "Неактивный",
            createdAt: cityResult.data.createdAt,
            updatedAt: cityResult.data.updatedAt,
          };
          setSelectedCity(formattedCity);
        }

        fetchCities();
      } else {
        message.error(result.message || "Ошибка при обновлении города");
      }
    } catch (error) {
      console.error("Error updating city:", error);
      message.error("Ошибка при обновлении города");
    } finally {
      setSaving(false);
    }
  };

  // Delete city
  const handleDeleteCity = async (cityId: number) => {
    try {
      const response = await fetch(`${API_URL}/cities/${cityId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Город успешно удален");
        fetchCities();
        if (selectedCity?.id === cityId) {
          setDrawerOpen(false);
          setSelectedCity(null);
          setIsEditing(false);
        }
      } else {
        message.error(result.message || "Ошибка при удалении города");
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      message.error("Ошибка при удалении города");
    }
  };

  // Delete selected cities
  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Выберите города для удаления");
      return;
    }

    Modal.confirm({
      title: "Удалить выбранные города?",
      content: `Вы уверены, что хотите удалить ${selectedRowKeys.length} городов?`,
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map((key) =>
            fetch(`${API_URL}/cities/${key}`, { method: "DELETE" }),
          );
          await Promise.all(deletePromises);
          message.success(`Удалено городов: ${selectedRowKeys.length}`);
          setSelectedRowKeys([]);
          fetchCities();
        } catch (error) {
          console.error("Error deleting cities:", error);
          message.error("Ошибка при удалении городов");
        }
      },
    });
  };

  const columns: ColumnsType<City> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Краткое",
      dataIndex: "short",
      key: "short",
      sorter: (a, b) => a.short.localeCompare(b.short),
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
              style={{ color: status === "Активный" ? "#52c41a" : "#faad14" }}
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
            title="Удалить город?"
            description={`Вы уверены, что хотите удалить ${record.name}?`}
            onConfirm={() => handleDeleteCity(record.id)}
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

  // Filter cities based on active filter
  const filteredCities = cities.filter((city) => {
    if (activeFilter === "Активные") {
      return city.status === "Активный";
    }
    return true;
  });

  // Format date
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
            Города
          </Title>
          <Tag>{cities.length}</Tag>
        </Flex>
        <Search
          placeholder="Поиск по названию"
          allowClear
          style={{ width: 400 }}
        />
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
              title="Удалить выбранные города?"
              description={`Вы уверены, что хотите удалить ${selectedRowKeys.length} городов?`}
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
          <Button
            icon={<PlusOutlined />}
            onClick={() => setAddDrawerOpen(true)}
          >
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
          dataSource={filteredCities}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedCity(record);
              setIsEditing(false);
              editForm.resetFields();
              setDrawerOpen(true);
            },
            style: { cursor: "pointer" },
          })}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredCities.length,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
            pageSizeOptions: ["10", "20", "50", "100"],
            locale: { items_per_page: "/ стр" },
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

      {/* Drawer с деталями города */}
      <Drawer
        title={
          selectedCity ? `${selectedCity.name} / ${selectedCity.short}` : ""
        }
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
                    name: selectedCity?.name,
                    short: selectedCity?.short,
                    status: selectedCity?.status === "Активный",
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
                title="Удалить город?"
                description={`Вы уверены, что хотите удалить ${selectedCity?.name}?`}
                onConfirm={() => {
                  if (selectedCity) {
                    handleDeleteCity(selectedCity.id);
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
        {selectedCity && (
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
                onFinish={handleUpdateCity}
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

                <Form.Item name="short" label="Краткое">
                  <Input placeholder="Введите текст" />
                </Form.Item>
              </Form>
            ) : (
              <Flex vertical gap={24}>
                {/* Основные данные */}
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
                      <Typography.Text>{selectedCity.name}</Typography.Text>
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
                        Краткое
                      </Typography.Text>
                      <Typography.Text>{selectedCity.short}</Typography.Text>
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
                          selectedCity.status === "Активный"
                            ? "success"
                            : "warning"
                        }
                        text={
                          <span
                            style={{
                              color:
                                selectedCity.status === "Активный"
                                  ? "#52c41a"
                                  : "#faad14",
                            }}
                          >
                            {selectedCity.status}
                          </span>
                        }
                      />
                    </div>
                  </Flex>
                </div>

                <Divider />

                {/* Системные данные */}
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
                        {formatDate(selectedCity.createdAt)}
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
                        {formatDate(selectedCity.updatedAt)}
                      </Typography.Text>
                    </div>
                  </Flex>
                </div>
              </Flex>
            )}
          </>
        )}
      </Drawer>

      {/* Drawer для добавления города */}
      <Drawer
        title="Добавить город"
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
          onFinish={handleCreateCity}
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
            <AutoComplete
              options={cityOptions}
              onSearch={handleCitySearch}
              notFoundContent={
                citySearchLoading ? "Загрузка..." : "Ничего не найдено"
              }
              filterOption={false}
              onSelect={(value) =>
                form.setFieldsValue({ name: value.split("::")[0] })
              }
            >
              <Input placeholder="Введите текст" />
            </AutoComplete>
          </Form.Item>

          <Form.Item name="short" label="Краткое">
            <Input placeholder="Введите текст" />
          </Form.Item>

          {/* Кнопка сохранить */}
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
