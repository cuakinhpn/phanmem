"use client";


import { useState, useCallback, useEffect } from "react";
import { TablePage } from "@/components/table/TablePage";
import { khoColumns } from "./khoConfig";
import { khoDeleteConfig, khoBulkDeleteConfig } from "./khoFormConfig";
import KhoFormModal from "./KhoFormModal";
import { khoPrintConfig } from "./khoPrintConfig";
import { customerImportConfig as khoImportConfig } from "./khoImportConfig";
import type { Kho } from "../../types/kho";
import { exportToExcel } from "../../lib/excelUtils";
import { addKhoAPI, updateKhoAPI } from "@/api/khoApi";
import { login } from "@/lib/login"; // Import hàm login

const API_URL = "http://118.69.170.50/API/api/ProductInfo/getDataProduct";

export default function KhoManagementPage() {
  const [data, setData] = useState<Kho[]>([]);
  const [isLoading, setIsInitialLoading] = useState(true) // Thêm dòng này
  const [isEditLoading, setIsEditLoading] = useState(false)
  // Fetch data from API and process it into the Customer interface
  useEffect(() => {
    const fetchData = async () => {
        setIsInitialLoading(true); // Set loading state to true at the start
        try {
            // Đăng nhập để lấy token
            const token = await login("ameinvoice", "amnote123", "2736", "VIET");

            // Gửi yêu cầu API với token
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const rawKhoData = await response.json();

            if (rawKhoData && rawKhoData.result) {
                const processedData: Kho[] = rawKhoData.result.map((item: any) => ({
                    id: item.KHO_CD,
                    PRODUCT_CD: item.PRODUCT_CD,
                    DivisionCD: item.DivisionCD,
                    PRODUCTKIND_CD: item.PRODUCTKIND_CD,
                    DepartmentCD: item.DepartmentCD,
                    PRODUCT_NM: item.PRODUCT_NM,
                    PRODUCT_NM_ENG: item.PRODUCT_NM_ENG,
                    PRODUCT_NM_KOR: item.PRODUCT_NM_KOR,
                    InboundUnitCD: item.InboundUnitCD,
                    OutboundUnitCD: item.OutboundUnitCD,
                    materialInputUnitCD: item.materialInputUnitCD,
                    StockUnitCD: item.StockUnitCD,
                    InboundQuantity: item.InboundQuantity,
                    OutboundQuantity: item.OutboundQuantity,
                    MaterialInputQuantity: item.MaterialInputQuantity,
                    StoreCD: item.StoreCD,
                    StandardCD: item.StandardCD,
                    FitnessStock: item.FitnessStock,
                    UnitPrice: item.UnitPrice,
                    FcUnitPirce: item.FcUnitPirce,
                    ExRate: item.ExRate,
                    lblCCType: item.lblCCType,
                    lblFCType: item.lblFCType,
                    txtSummary: item.txtSummary,
                    rgUseNotUse: item.rgUseNotUse,
                    HaveChildBOM: item.HaveChildBOM,
                    Origin: item.Origin,
                }));
                setData(processedData);
            }
        } catch (error) {
            console.error("Failed to fetch kho data:", error);
        } finally {
            setIsInitialLoading(false); // Set loading state to false after fetch completes
        }
    };

    fetchData();
  }, []);

  const handleImport = useCallback((rows: any[], method: "add" | "update" | "overwrite") => {
    console.log("Import kho data:", rows, "Method:", method);
  }, []);

  const handlePrint = useCallback((lang: "vi" | "en" | "ko") => {
    console.log("Print kho list in language:", lang);
  }, []);

  
  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const fetchData = async () => {
      try {
        // Đăng nhập để lấy token
        const token = await login("ameinvoice", "amnote123", "2736", "VIET");

        // Gửi yêu cầu API với token
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rawKhoData = await response.json();

        if (rawKhoData && rawKhoData.result) {
          const refreshedData: Kho[] = rawKhoData.result.map((item: any) => ({
            id: item.KHO_CD,
            khoUserCode: item.KHO_USER_CD || "",
            khoType: item.KHO_TYPE || "",
            categoryCode: item.CATEGORY_CD || null,
            categoryNameKor: item.CATEGORY_NAME_KOR || null,
            categoryNameEng: item.CATEGORY_NAME_ENG || null,
            categoryNameViet: item.CATEGORY_NAME_VIET || null,
            khoTypeNameKor: item.KHO_TYPE_NAME_KOR || "",
            khoTypeNameEng: item.KHO_TYPE_NAME_ENG || "",
            khoTypeNameViet: item.KHO_TYPE_NAME_VIET || "",
            nameVi: item.KHO_NM || "",
            nameEn: item.KHO_NM_EN || "",
            nameKo: item.KHO_NM_KOR || "",
            taxCode: item.TAX_CD || "",
            email: item.EMAIL || "",
            bankCode: item.BANK_CD || null,
            bankName: item.BANK_NM || null,
            accountNumber: item.ACCOUNT_NUM || null,
            citadCode: item.CITAD_CODE || null,
            tel: item.TEL || "",
            fax: item.FAX || "",
            ownerName: item.OWNER_NM || "",
            brn: item.BRN || "",
            businessType: item.BUSINESS_TYPE || "",
            kindBusiness: item.KIND_BUSINESS || "",
            notes: item.NOTE || "",
            addressName: item.ADDRESS_NM || "",
            addressDo: item.ADDRESS_DO || "",
            address: item.ADDRESS || "",
            inquiryIn: item.INQUIRY_IN || "",
            individual: item.INDIVIDUAL || "",
            nationality: item.NATIONALITY || "",
            idNumber: item.IDNUMBER || "",
            placeIssue: item.PLACE_ISSUE || "",
            dateIssue: item.DATE_ISSUE || "",
            customerReceive: item.CUSTOMER_RECEIVE || "",
            addressReceive: item.ADDRESS_RECEIVE || "",
            taxCodeReceive: item.TAX_CD_RECEIVE || "",
            paymentTerm: item.PAYMENT_TERM || 0,
            createdDate: new Date().toISOString().split("T")[0],
          }));
          setData(refreshedData);
        }
      } catch (error) {
        console.error("Failed to refresh kho data:", error);
      }
    };

    fetchData();
  }, []);
  const handleAdd = useCallback(async (newItem: Kho) => {
    try {
      const result = await addKhoAPI(newItem)
      if (result && result.success) {
        setIsEditLoading(true)
        // Nếu thành công, có thể lấy dữ liệu mới từ result.data nếu API trả về
        // setData((prev) => [result.data ? result.data : newItem, ...prev])
        await handleRefresh() // Tải lại dữ liệu sau khi thêm thành công
        setIsEditLoading(false)
        return { success: true, message: result.message || "Thêm mới kho hàng thành công!" }
      } else {
        return { success: false, message: result?.message || "Thêm mới kho hàng thất bại!" }
      }
    } catch (error) {
      console.error("Failed to add kho:", error)
      return { success: false, message: "Thêm mới kho hàng thất bại!" }
    }
  }, [handleRefresh])
  const handleEdit = useCallback(async (updatedItem: Kho) => {
    setIsEditLoading(true)
    try {
      const result = await updateKhoAPI(updatedItem);
      if (result.success) {
        await handleRefresh();
        setIsEditLoading(false)
        return { success: true, message: result.message || "Cập nhật kho hàng thành công!" };
      } else {
        setIsEditLoading(false)
        return { success: false, message: result.message || "Cập nhật kho hàng thất bại!" };
      }
    } catch (error) {
      setIsEditLoading(false)
      console.error("Failed to edit kho:", error);
      return { success: false, message: "Cập nhật kho hàng thất bại!" };
    }
  }, [handleRefresh])
  
  const handleExport = useCallback(() => {
    exportToExcel(data, khoColumns, "danh-sach-kho-hang.xlsx", "KhoHang");
    alert("Đã xuất dữ liệu kho hàng ra Excel thành công!");
  }, [data]);

  console.log("data", data)
  return (
    <TablePage
      title="Quản lý kho hàng"
      description="Quản lý danh sách thông tin kho hàng"
      columns={khoColumns}
      data={data}
      isInitialLoading={isLoading || isEditLoading}
      onImport={handleImport}
      onPrint={handlePrint}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onRefresh={handleRefresh}
      onExport={handleExport}
      searchFields={["id", "nameVi", "nameEn", "nameKo", "taxCode", "email", "tel", "address"]}
      enableTreeView={false}
      companyInfo={{
        name: "Công ty TNHH ABC Technology",
        address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
        taxCode: "0123456789",
      }}
      excelImportConfig={khoImportConfig}
      printConfig={khoPrintConfig}
      FormModalComponent={KhoFormModal}
      deleteConfig={khoDeleteConfig}
      bulkDeleteConfig={khoBulkDeleteConfig}
      onAdd={handleAdd}
      onEdit={handleEdit}
    />
  );
}