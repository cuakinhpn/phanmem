"use client";

import { useState, useCallback, useEffect } from "react";
import { TablePage } from "@/components/table/TablePage";
import { materialGroupColumns } from "./materialGroupConfig";
import MaterialGroupFormModal from "./MaterialGroupFormModal";
import { materialGroupPrintConfig } from "./materialGroupPrintConfig";
import { materialGroupImportConfig } from "./materialGroupImportConfig";
import { materialGroupDeleteConfig, materialGroupBulkDeleteConfig } from "./materialGroupDeleteConfig";
import { exportToExcel } from "@/lib/excelUtils";
import type { MaterialKind } from "@/types/material";
import { login } from "@/lib/login";
import { addMaterialGroupAPI, updateMaterialGroupAPI, deleteMaterialGroupAPI } from "./materialGroupApi";

const API_URL = "http://118.69.170.50/API/api/ProductKind/getAllProductKind";

export default function MaterialGroupPage() {
  const [data, setData] = useState<MaterialKind[]>([]);
  const [isLoading, setIsInitialLoading] = useState(true);
  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsInitialLoading(true);
      try {
        const token = await login("ameinvoice", "amnote123", "2736", "VIET");
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rawMaterialGroupData = await response.json();
        if (rawMaterialGroupData && rawMaterialGroupData.result) {
          const processedData: MaterialKind[] = rawMaterialGroupData.result.map((item: any) => ({
            id: item.PRODUCTKIND_CD,
            PRODUCTKIND_CD: item.PRODUCTKIND_CD,
            PRODUCTKIND_NM: item.PRODUCTKIND_NM,
            PRODUCTKIND_NM_ENG: item.PRODUCTKIND_NM_ENG,
            PRODUCTKIND_NM_KOR: item.PRODUCTKIND_NM_KOR,
            REMARK: item.REMARK,
            COUNT: item.COUNT,
          }));
          setData(processedData);
        }
      } catch (error) {
        console.error("Failed to fetch material group data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImport = useCallback((rows: any[], method: "add" | "update" | "overwrite") => {
    console.log("Import material group data:", rows, "Method:", method);
  }, []);

  const handlePrint = useCallback((lang: "vi" | "en" | "ko") => {
    console.log("Print material group list in language:", lang);
  }, []);

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const token = await login("ameinvoice", "amnote123", "2736", "VIET");
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rawMaterialGroupData = await response.json();
    if (rawMaterialGroupData && rawMaterialGroupData.result) {
      const refreshedData: MaterialKind[] = rawMaterialGroupData.result.map((item: any) => ({
        id: item.PRODUCTKIND_CD,
        PRODUCTKIND_CD: item.PRODUCTKIND_CD,
        PRODUCTKIND_NM: item.PRODUCTKIND_NM,
        PRODUCTKIND_NM_ENG: item.PRODUCTKIND_NM_ENG,
        PRODUCTKIND_NM_KOR: item.PRODUCTKIND_NM_KOR,
        REMARK: item.REMARK,
        COUNT: item.COUNT,
      }));
      setData(refreshedData);
    }
  }, []);

  const handleAdd = useCallback(async (newItem: MaterialKind) => {
    setIsEditLoading(true);
    try {
      const result = await addMaterialGroupAPI(newItem);
      console.log("API addMaterialGroupAPI result:", result);
      let addedItem: MaterialKind;
      if (result && result.status === "success" && Array.isArray(result.result) && result.result.length > 0) {
        addedItem = result.result[0];
        setData((prev) => [...prev, addedItem]);
        await handleRefresh();
        setIsEditLoading(false);
        return { success: true, message: result.message?.[0] || "Thêm mới nhóm vật tư thành công!" };
      } else {
        setIsEditLoading(false);
        // Ưu tiên lấy messages nếu có, sau đó mới lấy message
        let apiMsg = '';
        if (Array.isArray(result?.messages) && result.messages.length > 0) {
          apiMsg = result.messages.filter(Boolean).join('; ');
        } else if (Array.isArray(result?.message)) {
          apiMsg = result.message.filter(Boolean).join('; ');
        } else {
          apiMsg = result?.message || '';
        }
        return { success: false, message: apiMsg ? `Thêm mới nhóm vật tư thất bại! ${apiMsg}` : "Thêm mới nhóm vật tư thất bại!" };
      }
    } catch (error: any) {
      setIsEditLoading(false);
      console.error("Failed to add material group:", error);
      // Nếu error có response/message từ API thì show luôn
      let apiMsg = error?.response?.data?.message;
      if (Array.isArray(apiMsg)) apiMsg = apiMsg.filter(Boolean).join("; ");
      return { success: false, message: apiMsg ? `Thêm mới nhóm vật tư thất bại! ${apiMsg}` : "Thêm mới nhóm vật tư thất bại!" };
    }
  }, [handleRefresh]);

  const handleEdit = useCallback(async (updatedItem: MaterialKind) => {
    setIsEditLoading(true);
    try {
      const result = await updateMaterialGroupAPI(updatedItem);
      console.log("API updateMaterialGroupAPI result:", result);
      let editedItem: MaterialKind;
      if (result && result.status === "success" && Array.isArray(result.result) && result.result.length > 0) {
        editedItem = result.result[0];
        setData((prev) => prev.map((item) => item.id === editedItem.id ? editedItem : item));
        await handleRefresh();
        setIsEditLoading(false);
        return { success: true, message: result.message?.[0] || "Cập nhật nhóm vật tư thành công!" };
      } else {
        setIsEditLoading(false);
        return { success: false, message: result?.message?.[0] || "Cập nhật nhóm vật tư thất bại!" };
      }
    } catch (error) {
      setIsEditLoading(false);
      console.error("Failed to edit material group:", error);
      return { success: false, message: "Cập nhật nhóm vật tư thất bại!" };
    }
  }, [handleRefresh]);

  const handleDelete = useCallback(async (id: string) => {
    setIsEditLoading(true);
    let result;
    try {
      result = await deleteMaterialGroupAPI(id);
      console.log("API deleteMaterialGroupAPI result:", result);
    } catch (error) {
      console.error("Failed to delete material group:", error);
      result = { success: false, message: "Xóa nhóm vật tư thất bại!" };
    }
    await handleRefresh();
    setIsEditLoading(false);
    if (result && result.success) {
      return { success: true, message: result.message || "Xóa nhóm vật tư thành công!" };
    } else {
      return { success: false, message: result?.message || "Xóa nhóm vật tư thất bại!" };
    }
  }, [handleRefresh]);

  const handleExport = useCallback(() => {
    exportToExcel(data, materialGroupColumns, "danh-sach-nhom-vat-tu.xlsx", "NhomVatTu");
    alert("Đã xuất dữ liệu nhóm vật tư ra Excel thành công!");
  }, [data]);

  return (
    <TablePage
      title="Quản lý nhóm vật tư"
      description="Quản lý danh sách nhóm vật tư"
      columns={materialGroupColumns}
      data={data}
      isInitialLoading={isLoading || isEditLoading}
      onImport={handleImport}
      onPrint={handlePrint}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onRefresh={handleRefresh}
      onExport={handleExport}
      searchFields={["PRODUCTKIND_CD", "PRODUCTKIND_NM", "PRODUCTKIND_NM_ENG", "PRODUCTKIND_NM_KOR", "REMARK"]}
      enableTreeView={false}
      companyInfo={{
        name: "Công ty TNHH ABC Technology",
        address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
        taxCode: "0123456789",
      }}
      excelImportConfig={materialGroupImportConfig}
      printConfig={materialGroupPrintConfig}
      FormModalComponent={MaterialGroupFormModal}
      deleteConfig={materialGroupDeleteConfig}
      bulkDeleteConfig={materialGroupBulkDeleteConfig}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onEdit={handleEdit}
    />
  );
}
