import React, { useEffect, useState } from "react";
import {
  Card,
  Upload,
  Button,
  Space,
  Spin,
  message,
  Empty,
  Progress,
  Table,
} from "antd";
import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import { photosAPI, ocrAPI } from "../services/api";
import { Photo, OcrResult } from "../types";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingOcr, setUploadingOcr] = useState<number | null>(null);
  const [ocrResults, setOcrResults] = useState<OcrResult[]>([]);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await photosAPI.list();
      setPhotos(data || []);
    } catch (error) {
      message.error("Erro ao carregar fotos");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await photosAPI.upload(file);
      message.success("Foto enviada com sucesso");
      loadPhotos();
    } catch (error) {
      message.error("Erro ao enviar foto");
    }
    return false;
  };

  const handleAnalyzePhoto = async (photoId: number) => {
    try {
      setUploadingOcr(photoId);
      const result = await ocrAPI.analyze(photoId);
      message.success("Análise OCR concluída");
      setOcrResults([...ocrResults, { id: 0, photoId, ...result }]);
      loadPhotos();
    } catch (error) {
      message.error("Erro ao analisar foto");
    } finally {
      setUploadingOcr(null);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    try {
      await photosAPI.delete(id);
      message.success("Foto removida");
      loadPhotos();
    } catch (error) {
      message.error("Erro ao remover foto");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "Pré-visualização",
      dataIndex: "filePath",
      key: "preview",
      width: "20%",
      render: (filePath: string) => (
        <img
          src={filePath}
          alt="preview"
          style={{ maxWidth: "80px", maxHeight: "80px" }}
        />
      ),
    },
    {
      title: "Upload",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      width: "20%",
      render: (date: string) =>
        new Date(date).toLocaleDateString("pt-PT") +
        " " +
        new Date(date).toLocaleTimeString("pt-PT"),
    },
    {
      title: "Status OCR",
      dataIndex: "id",
      key: "ocrStatus",
      width: "15%",
      render: (id: number, record: Photo) => {
        const hasOcr = record.ocrResults && record.ocrResults.length > 0;
        return hasOcr ? (
          <span style={{ color: "#52b788" }}>✓ Analisado</span>
        ) : (
          <span style={{ color: "#d4a574" }}>Pendente</span>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: "20%",
      render: (_: any, record: Photo) => (
        <Space size="small">
          {!record.ocrResults?.length && (
            <Button
              size="small"
              onClick={() => handleAnalyzePhoto(record.id)}
              loading={uploadingOcr === record.id}
            >
              {uploadingOcr === record.id ? (
                <>
                  <LoadingOutlined /> OCR...
                </>
              ) : (
                "Analisar"
              )}
            </Button>
          )}
          <Button
            size="small"
            danger
            onClick={() => handleDeletePhoto(record.id)}
          >
            Remover
          </Button>
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
      <h1>Fotos & OCR</h1>

      <Card style={{ marginBottom: "24px" }}>
        <h2>Enviar Fotos das Prateleiras</h2>
        <Upload.Dragger
          name="file"
          accept="image/*"
          multiple
          beforeUpload={handleUpload}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: "#2d6a4f", fontSize: "48px" }} />
          </p>
          <p className="ant-upload-text">
            Clique ou arraste fotos aqui
          </p>
          <p className="ant-upload-hint">
            Pode enviar múltiplas fotos. Formatos: JPG, PNG, GIF, WebP
          </p>
        </Upload.Dragger>
      </Card>

      <Card>
        <h2>Fotos Carregadas</h2>
        {photos.length === 0 ? (
          <Empty description="Nenhuma foto carregada" />
        ) : (
          <Table
            dataSource={photos}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      {ocrResults.length > 0 && (
        <Card style={{ marginTop: "24px" }}>
          <h2>Resultados de OCR</h2>
          <Table
            dataSource={ocrResults}
            columns={[
              { title: "Foto ID", dataIndex: "photoId", key: "photoId" },
              {
                title: "Título Extraído",
                dataIndex: "extractedTitle",
                key: "title",
              },
              {
                title: "Autor Extraído",
                dataIndex: "extractedAuthor",
                key: "author",
              },
              {
                title: "Confiança",
                dataIndex: "confidence",
                key: "confidence",
                render: (conf: number) => (
                  <Progress
                    type="circle"
                    percent={Math.round((conf || 0) * 100)}
                    width={50}
                  />
                ),
              },
            ]}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}
    </div>
  );
}
