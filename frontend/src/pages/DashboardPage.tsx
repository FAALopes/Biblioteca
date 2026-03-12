import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, message } from "antd";
import { BookOutlined, CheckCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { booksAPI } from "../services/api";

interface Stats {
  total: number;
  catalogued: number;
  percentCatalogued: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await booksAPI.getStats();
        setStats(data);
      } catch (error) {
        message.error("Erro ao carregar estatísticas");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Carregando..." />
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao sistema de inventário de biblioteca.</p>

      <Row gutter={16} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Livros"
              value={stats?.total || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#2d6a4f" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Livros Catalogados"
              value={stats?.catalogued || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52b788" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="% Catalogação"
              value={stats?.percentCatalogued || 0}
              suffix="%"
              valueStyle={{ color: "#40916c" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Fotos Pendentes"
              value={0}
              prefix={<FileImageOutlined />}
              valueStyle={{ color: "#d4a574" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card title="Próximos Passos">
            <ul>
              <li>📸 Fazer upload de fotografias das prateleiras</li>
              <li>📊 Importar dados do ficheiro Excel</li>
              <li>📚 Catalogar livros manualmente</li>
              <li>🏷️ Gerenciar prateleiras e posições</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
