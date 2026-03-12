import React, { useEffect, useState } from "react";
import { Table, Button, Input, Select, Spin, message, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { booksAPI, shelvesAPI } from "../services/api";
import { Book, Shelf } from "../types";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedShelf, setSelectedShelf] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  useEffect(() => {
    loadBooks();
    loadShelves();
  }, [search, selectedShelf, selectedStatus]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await booksAPI.list({
        search: search || undefined,
        shelfId: selectedShelf,
        status: selectedStatus,
      });
      setBooks(data.books || []);
    } catch (error) {
      message.error("Erro ao carregar livros");
    } finally {
      setLoading(false);
    }
  };

  const loadShelves = async () => {
    try {
      const data = await shelvesAPI.list();
      setShelves(data || []);
    } catch (error) {
      console.error("Erro ao carregar prateleiras", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await booksAPI.delete(id);
      message.success("Livro removido com sucesso");
      loadBooks();
    } catch (error) {
      message.error("Erro ao remover livro");
    }
  };

  const columns = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      width: "30%",
    },
    {
      title: "Autor",
      dataIndex: "author",
      key: "author",
      width: "20%",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
      width: "15%",
    },
    {
      title: "Prateleira",
      dataIndex: ["shelf", "label"],
      key: "shelf",
      width: "12%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "13%",
      render: (status: string) => (
        <span style={{ color: status === "catalogado" ? "#52b788" : "#d4a574" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: "10%",
      render: (_: any, record: Book) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Popconfirm
            title="Remover livro?"
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

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <h1>Livros</h1>
        <Space style={{ marginBottom: "16px", gap: "8px" }}>
          <Input
            placeholder="Pesquisar por título, autor ou ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "300px" }}
          />
          <Select
            placeholder="Filtrar por prateleira"
            value={selectedShelf}
            onChange={setSelectedShelf}
            allowClear
            style={{ width: "150px" }}
            options={shelves.map((s) => ({
              label: s.label,
              value: s.id,
            }))}
          />
          <Select
            placeholder="Filtrar por status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            allowClear
            style={{ width: "150px" }}
            options={[
              { label: "Catalogado", value: "catalogado" },
              { label: "Não Catalogado", value: "nao-catalogado" },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Novo Livro
          </Button>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={books}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      )}
    </div>
  );
}
