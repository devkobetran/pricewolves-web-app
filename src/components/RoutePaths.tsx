import React, { lazy } from "react"
import { Routes, Route } from "react-router-dom"

const HomePage = lazy(() => import("../pages/Home.tsx"))
const DashboardPage = lazy(() => import("../pages/Dashboard.tsx"))
const AddItemPage = lazy(() => import("../pages/AddItem.tsx"))
const CreateNewItemPage = lazy(() => import("../pages/CreateNewItem.tsx"))
const CreateNewStorePage = lazy(() => import("../pages/CreateNewStore.tsx"))
const NotFoundPage = lazy(() => import("../pages/NotFound.tsx"))

const RoutePaths: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/add-item" element={<AddItemPage />} />
      <Route path="/create-new-item" element={<CreateNewItemPage />} />
      <Route path="/create-new-store" element={<CreateNewStorePage />} />

      {/* 404 page */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoutePaths
