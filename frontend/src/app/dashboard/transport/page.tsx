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
  Radio,
  Table,
  Badge,
  Image,
  Drawer,
  Divider,
  Form,
  Switch,
  message,
  Spin,
  Modal,
  Popconfirm,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
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
  PictureOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface Transport {
  key: string;
  id: number;
  name: string;
  type: string;
  description: string;
  photos: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function TransportPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeFilter, setActiveFilter] = useState<string>("Активные");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(
    null,
  );
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Data states
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addFileList, setAddFileList] = useState<UploadFile[]>([]);
  const [editFileList, setEditFileList] = useState<UploadFile[]>([]);

  // Fetch transports
  const fetchTransports = async () => {
    try {
      const response = await fetch(`${API_URL}/transports`);
      const result = await response.json();
      if (result.data) {
        setTransports(result.data);
      }
    } catch (error) {
      console.error("Error fetching transports:", error);
      message.error("Ошибка при загрузке транспорта");
    }
  };

  const apiBase = API_URL.replace(/\/api\/?$/, "");

  const uploadTransportPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/uploads/transports`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Ошибка загрузки файла");
    }

    const urlPath = result.url || "";
    return urlPath.startsWith("http") ? urlPath : `${apiBase}${urlPath}`;
  };

  const normalizeUploadList = (fileList: UploadFile[]) =>
    fileList.map((file) => {
      const responseUrl = (file.response as { url?: string })?.url;
      if (responseUrl && !file.url) {
        return { ...file, url: responseUrl };
      }
      return file;
    });

  const renderTransportFields = (
    fileList: UploadFile[],
    setFileList: (files: UploadFile[]) => void,
  ) => (
    <>
      <Title level={4} style={{ marginBottom: 24, textAlign: "center" }}>
        Основные данные
      </Title>

      <Form.Item name="status" label="Статус" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="name" label="Наименование">
        <Input placeholder="Введите текст" />
      </Form.Item>

      <Form.Item name="type" label="Вид">
        <Radio.Group
          block
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: "Городской", value: "city" },
            { label: "Межгород", value: "intercity" },
          ]}
        />
      </Form.Item>

      <Form.Item name="description" label="Описание">
        <Input placeholder="Введите текст" />
      </Form.Item>

      <Form.Item label="Фото">
        <Upload
          listType="picture-card"
          multiple
          fileList={fileList}
          customRequest={async ({ file, onSuccess, onError }) => {
            try {
              const url = await uploadTransportPhoto(file as File);
              onSuccess?.({ url });
            } catch (uploadError) {
              onError?.(uploadError as Error);
            }
          }}
          onChange={({ fileList: nextList }) =>
            setFileList(normalizeUploadList(nextList))
          }
        >
          {fileList.length >= 10 ? null : "+ Фото"}
        </Upload>
      </Form.Item>
    </>
  );

  const buildFileListFromUrls = (urls: string[]) =>
    urls.map((url) => ({
      uid: url,
      name: url.split("/").pop() || "photo",
      status: "done",
      url,
    }));

  const extractPhotoUrls = (files: UploadFile[]) =>
    files
      .map((file) => file.url || (file.response as { url?: string })?.url)
      .filter(Boolean) as string[];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTransports();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCreateTransport = async (values: {
    name: string;
    type: string;
    description: string;
    status: boolean;
  }) => {
    setSaving(true);
    try {
      const photos = extractPhotoUrls(addFileList);
      const response = await fetch(`${API_URL}/transports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, photos }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Транспорт успешно создан");
        setAddDrawerOpen(false);
        form.resetFields();
        setAddFileList([]);
        fetchTransports();
      } else {
        message.error(result.message || "Ошибка при создании транспорта");
      }
    } catch (error) {
      console.error("Error creating transport:", error);
      message.error("Ошибка при создании транспорта");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTransport = async (values: {
    name: string;
    type: string;
    description: string;
    status: boolean;
  }) => {
    if (!selectedTransport) return;

    setSaving(true);
    try {
      const photos = extractPhotoUrls(editFileList);
      const response = await fetch(
        `${API_URL}/transports/${selectedTransport.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, photos }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        message.success("Транспорт успешно обновлен");
        setIsEditing(false);

        const transportResponse = await fetch(
          `${API_URL}/transports/${selectedTransport.id}`,
        );
        const transportResult = await transportResponse.json();
        if (transportResult.data) {
          const formattedTransport = {
            key: transportResult.data.id.toString(),
            id: transportResult.data.id,
            name: transportResult.data.name,
            type:
              transportResult.data.type === "intercity"
                ? "Межгород"
                : "Городской",
            description: transportResult.data.description || "",
            photos: transportResult.data.photos || [],
            status:
              transportResult.data.status === "active"
                ? "Активный"
                : "Неактивный",
            createdAt: transportResult.data.createdAt,
            updatedAt: transportResult.data.updatedAt,
          };
          setSelectedTransport(formattedTransport);
          setEditFileList(buildFileListFromUrls(formattedTransport.photos));
        }

        fetchTransports();
      } else {
        message.error(result.message || "Ошибка при обновлении транспорта");
      }
    } catch (error) {
      console.error("Error updating transport:", error);
      message.error("Ошибка при обновлении транспорта");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTransport = async (transportId: number) => {
    try {
      const response = await fetch(`${API_URL}/transports/${transportId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Транспорт успешно удален");
        fetchTransports();
        if (selectedTransport?.id === transportId) {
          setDrawerOpen(false);
          setSelectedTransport(null);
          setIsEditing(false);
        }
      } else {
        message.error(result.message || "Ошибка при удалении транспорта");
      }
    } catch (error) {
      console.error("Error deleting transport:", error);
      message.error("Ошибка при удалении транспорта");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Выберите транспорт для удаления");
      return;
    }

    Modal.confirm({
      title: "Удалить выбранный транспорт?",
      content: `Вы уверены, что хотите удалить ${selectedRowKeys.length} элементов?`,
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map((key) =>
            fetch(`${API_URL}/transports/${key}`, { method: "DELETE" }),
          );
          await Promise.all(deletePromises);
          message.success(`Удалено элементов: ${selectedRowKeys.length}`);
          setSelectedRowKeys([]);
          fetchTransports();
        } catch (error) {
          console.error("Error deleting transports:", error);
          message.error("Ошибка при удалении транспорта");
        }
      },
    });
  };

  const columns: ColumnsType<Transport> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Вид",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Фото",
      dataIndex: "photo",
      key: "photo",
      render: (_, record) =>
        record.photos?.length ? (
          <Image
            src={record.photos[0]}
            alt="Transport"
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: 4 }}
            fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAiIHk9IjUwIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+PGltYWdlLz48L3RleHQ+PC9zdmc+"
          />
        ) : (
          <PictureOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />
        ),
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
            title="Удалить транспорт?"
            description={`Вы уверены, что хотите удалить ${record.name}?`}
            onConfirm={() => handleDeleteTransport(record.id)}
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

  const filteredTransports = transports.filter((transport) => {
    if (activeFilter === "Активные") {
      return transport.status === "Активный";
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
            Транспорт
          </Title>
          <Tag>{transports.length}</Tag>
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
              title="Удалить выбранный транспорт?"
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
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setAddDrawerOpen(true);
              setAddFileList([]);
              form.resetFields();
            }}
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
          dataSource={filteredTransports}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedTransport(record);
              setIsEditing(false);
              editForm.resetFields();
              setDrawerOpen(true);
            },
            style: { cursor: "pointer" },
          })}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredTransports.length,
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
        title={selectedTransport ? selectedTransport.name : ""}
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
                    name: selectedTransport?.name,
                    type:
                      selectedTransport?.type === "Межгород"
                        ? "intercity"
                        : "city",
                    description: selectedTransport?.description,
                    status: selectedTransport?.status === "Активный",
                  });
                  setEditFileList(
                    buildFileListFromUrls(selectedTransport?.photos || []),
                  );
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
                    setEditFileList(
                      buildFileListFromUrls(selectedTransport?.photos || []),
                    );
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
                title="Удалить транспорт?"
                description={`Вы уверены, что хотите удалить ${selectedTransport?.name}?`}
                onConfirm={() => {
                  if (selectedTransport) {
                    handleDeleteTransport(selectedTransport.id);
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
        {selectedTransport && (
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
                onFinish={handleUpdateTransport}
              >
                {renderTransportFields(editFileList, setEditFileList)}
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
                      <Typography.Text>
                        {selectedTransport.name}
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
                        Вид
                      </Typography.Text>
                      <Typography.Text>
                        {selectedTransport.type}
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
                        Описание
                      </Typography.Text>
                      <Typography.Text>
                        {selectedTransport.description || "-"}
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
                        Фото
                      </Typography.Text>
                      <Flex wrap="wrap" gap={8}>
                        {selectedTransport.photos?.length ? (
                          selectedTransport.photos.map((url) => (
                            <Image
                              key={url}
                              src={url}
                              alt={selectedTransport.name}
                              width={120}
                              height={80}
                              style={{ objectFit: "cover", borderRadius: 6 }}
                            />
                          ))
                        ) : (
                          <PictureOutlined
                            style={{ fontSize: 32, color: "#d9d9d9" }}
                          />
                        )}
                      </Flex>
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
                          selectedTransport.status === "Активный"
                            ? "success"
                            : "warning"
                        }
                        text={
                          <span
                            style={{
                              color:
                                selectedTransport.status === "Активный"
                                  ? "#52c41a"
                                  : "#faad14",
                            }}
                          >
                            {selectedTransport.status}
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
                        {formatDate(selectedTransport.createdAt)}
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
                        {formatDate(selectedTransport.updatedAt)}
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
        title="Добавить транспорт"
        placement="right"
        open={addDrawerOpen}
        onClose={() => {
          setAddDrawerOpen(false);
          setAddFileList([]);
          form.resetFields();
        }}
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
          onFinish={handleCreateTransport}
          initialValues={{ status: true, type: "city" }}
        >
          {renderTransportFields(addFileList, setAddFileList)}

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
