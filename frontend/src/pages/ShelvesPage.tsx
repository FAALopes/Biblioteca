import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Spin,
  message,
  Space,
  Popconfirm,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { shelvesAPI } from "../services/api";
import { Shelf } from "../types";

export default function ShelvesPage() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadShelves();
  }, []);

  const loadShelves = async () => {
    try {
      setLoading(true);
      const data = await shelvesAPI.list();
      setShelves(data || []);
    } catch (error) {
      message.error("Erro ao carregar prateleiras");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (shelf?: Shelf) => {
    setEditingId(shelf?.id || null);
    if (shelf) {
      form.setFieldsValue(shelf);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (editingId) {
        await shelvesAPI.update(editingId, values);
        message.success("Prateleira atualizada");
      } else {
        await shelvesAPI.create(values);
        message.success("Prateleira criada");
      }
      setIsModalVisible(false);
      loadShelves();
    } catch (error) {
      message.error("Erro ao guardar prateleira");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await shelvesAPI.delete(id);
      message.success("Prateleira removida");
      loadShelves();
    } catch (error) {
      message.error("Erro ao remover prateleira");
    }
  };

  const columns = [
    {
      title: "Rótulo",
      dataIndex: "label",
      key: "label",
      width: "15%",
    },
    {
      title: "Secção",
      dataIndex: "sectionLetter",
      key: "sectionLetter",
      width: "10%",
    },
    {
      title: "Número",
      dataIndex: "shelfNumber",
      key: "shelfNumber",
      width: "10%",
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      key: "capacity",
      width: "10%",
    },
    {
      title: "Livros",
      dataIndex: ["_count", "books"],
      key: "books",
      width: "10%",
      render: (count: number) => count || 0,
    },
    {
      title: "Notas",
      dataIndex: "notes",
      key: "notes",
      width: "25%",
    },
    {
      title: "Ações",
      key: "actions",
      width: "10%",
      render: (_: any, record: Shelf) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            size="small"
          />
          <Popconfirm
            title="Remover prateleira?"
            description="Tem a certeza? (Só pode remover se vazia)"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <h1>Prateleiras</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Nova Prateleira
        </Button>
      </div>

      <Card>
        <Table
          dataSource={shelves}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={editingId ? "Editar Prateleira" : "Nova Prateleira"}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="Rótulo (ex: A1, B2)"
            name="label"
            rules={[{ required: true, message: "Rótulo obrigatório" }]}
          >
            <Input placeholder="A1" />
          </Form.Item>

          <Form.Item
            label="Secção (letra: A, B, C...)"
            name="sectionLetter"
            rules={[{ required: true, message: "Secção obrigatória" }]}
          >
            <Input placeholder="A" maxLength={1} />
          </Form.Item>

          <Form.Item
            label="Número (1, 2, 3...)"
            name="shelfNumber"
            rules={[{ required: true, message: "Número obrigatório" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item label="Capacidade máxima" name="capacity">
            <InputNumber min={1} placeholder="(opcional)" />
          </Form.Item>

          <Form.Item label="Notas" name="notes">
            <Input.TextArea rows={2} placeholder="(opcional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
