import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import ptPT from "antd/locale/pt_PT";
import Layout from "./components/Layout";
import customTheme from "./theme/customTheme";

// Pages
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";
import ShelvesPage from "./pages/ShelvesPage";
import PhotosPage from "./pages/PhotosPage";


function App() {
  return (
    <ConfigProvider theme={customTheme} locale={ptPT}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/shelves" element={<ShelvesPage />} />
            <Route path="/photos" element={<PhotosPage />} />

          </Routes>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
