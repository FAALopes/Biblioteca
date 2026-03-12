import { useState } from "react";
import {
  Steps,
  Button,
  Card,
  Upload,
  Table,
  message,
  Spin,
  Alert,
  Select,
  Space,
} from "antd";
import { InboxOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { importAPI } from "../services/api";

interface ColumnMapping {
  titleCol: string | null;
  authorCol: string | null;
  isbnCol: string | null;
  locationCol: string | null;
}

export default function ImportPage() {
  const [step, setStep] = useState(0);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = async (file: File) => {
    // Converter para base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      setFileBase64(base64 || null);
    };
    reader.readAsDataURL(file);

    // Parse e preview
    try {
      setLoading(true);
      const data = await importAPI.uploadExcel(file);

      setPreview(data.firstRows || []);
      setColumnMapping(data.columnMapping);

      if (data.firstRows.length > 0) {
        setAvailableColumns(Object.keys(data.firstRows[0]));
      }

      setStep(1);
      message.success("Ficheiro carregado com sucesso");
    } catch (error) {
      message.error("Erro ao processar ficheiro");
    } finally {
      setLoading(false);
    }
  };

  const handleColumnChange = (colType: keyof ColumnMapping, value: string) => {
    setColumnMapping((prev) => ({
      ...prev!,
      [colType]: value || null,
    }));
  };

  const handleMerge = async () => {
    if (!fileBase64 || !columnMapping) {
      message.error("Dados incompletos");
      return;
    }

    try {
      setLoading(true);
      const data = await importAPI.merge({
        fileBase64,
        columnMapping,
      });

      setResult(data);
      setStep(2);
      message.success("Importação concluída!");
    } catch (error) {
      message.error("Erro ao importar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Importar Excel</h1>

      <Steps
        current={step}
        items={[
          { title: "Upload", description: "Enviar ficheiro" },
          { title: "Configurar", description: "Mapear colunas" },
          { title: "Resultado", description: "Dados importados" },
        ]}
        style={{ marginBottom: "24px" }}
      />

      {step === 0 && (
        <Card>
          <Upload.Dragger
            name="file"
            accept=".xlsx,.xls,.csv"
            maxCount={1}
            beforeUpload={(file) => {
              handleFileChange(file);
              return false;
            }}
            disabled={loading}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#2d6a4f", fontSize: "48px" }} />
            </p>
            <p className="ant-upload-text">
              Clique ou arraste um ficheiro Excel aqui
            </p>
            <p className="ant-upload-hint">
              Formatos suportados: .xlsx, .xls, .csv
            </p>
          </Upload.Dragger>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <h2>Visualizar e Configurar Colunas</h2>

          {loading ? (
            <Spin />
          ) : (
            <>
              <Alert
                message="Mapeie as colunas do Excel com os campos da aplicação"
                type="info"
                style={{ marginBottom: "16px" }}
              />

              <div style={{ marginBottom: "16px" }}>
                <h3>Seleção de Colunas:</h3>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <label>Coluna de Título: </label>
                    <Select
                      value={columnMapping?.titleCol || undefined}
                      onChange={(val) =>
                        handleColumnChange("titleCol", val)
                      }
                      options={availableColumns.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      placeholder="Selecionar coluna de título"
                      style={{ width: "300px" }}
                    />
                  </div>

                  <div>
                    <label>Coluna de Autor: </label>
                    <Select
                      value={columnMapping?.authorCol || undefined}
                      onChange={(val) =>
                        handleColumnChange("authorCol", val)
                      }
                      options={availableColumns.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      placeholder="(opcional)"
                      style={{ width: "300px" }}
                      allowClear
                    />
                  </div>

                  <div>
                    <label>Coluna de ISBN: </label>
                    <Select
                      value={columnMapping?.isbnCol || undefined}
                      onChange={(val) =>
                        handleColumnChange("isbnCol", val)
                      }
                      options={availableColumns.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      placeholder="(opcional)"
                      style={{ width: "300px" }}
                      allowClear
                    />
                  </div>

                  <div>
                    <label>Coluna de Localização (Prateleira): </label>
                    <Select
                      value={columnMapping?.locationCol || undefined}
                      onChange={(val) =>
                        handleColumnChange("locationCol", val)
                      }
                      options={availableColumns.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      placeholder="(opcional)"
                      style={{ width: "300px" }}
                      allowClear
                    />
                  </div>
                </Space>
              </div>

              <div style={{ marginTop: "24px" }}>
                <h3>Pré-visualização:</h3>
                <Table
                  dataSource={preview}
                  columns={availableColumns.slice(0, 5).map((col) => ({
                    title: col,
                    dataIndex: col,
                    key: col,
                  }))}
                  pagination={{ pageSize: 5 }}
                  size="small"
                  scroll={{ x: 600 }}
                />
              </div>

              <div style={{ marginTop: "24px" }}>
                <Button onClick={() => setStep(0)}>Voltar</Button>
                <Button
                  type="primary"
                  onClick={handleMerge}
                  loading={loading}
                  style={{ marginLeft: "8px" }}
                >
                  Importar
                </Button>
              </div>
            </>
          )}
        </Card>
      )}

      {step === 2 && result && (
        <Card>
          <h2>
            <CheckCircleOutlined
              style={{ color: "#52b788", marginRight: "8px" }}
            />
            Importação Concluída!
          </h2>

          <Alert
            message={`${result.successCount} livros importados com sucesso`}
            type="success"
            showIcon
            style={{ marginBottom: "16px" }}
          />

          {result.errorCount > 0 && (
            <Alert
              message={`${result.errorCount} erros encontrados`}
              type="warning"
              style={{ marginBottom: "16px" }}
            />
          )}

          {result.errors.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h3>Erros:</h3>
              <Table
                dataSource={result.errors}
                columns={[
                  { title: "Linha", dataIndex: "row", key: "row" },
                  { title: "Erro", dataIndex: "error", key: "error" },
                ]}
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </div>
          )}

          <Button type="primary" onClick={() => setStep(0)}>
            Importar Outro Ficheiro
          </Button>
        </Card>
      )}
    </div>
  );
}
