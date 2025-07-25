"use client";


import { useState, useCallback, useEffect } from "react";
import { TablePage } from "@/components/table/TablePage";
import { customerColumns } from "./customerConfig";
import { customerDeleteConfig, customerBulkDeleteConfig } from "./customerFormConfig";
import CustomerFormModal from "./CustomerFormModal";
import { customerPrintConfig } from "./customerPrintConfig";
import { customerImportConfig } from "./customerImportConfig"
import { exportToExcel } from "@/lib/excelUtils";
import type { Customer } from "@/types/customer"; // Import the new Customer interface
import { login } from "@/lib/login"; // Import hàm login
import { addCustomerAPI, updateCustomerAPI } from "@/api/customerApi";


const API_URL = "http://118.69.170.50/API/api/CustomerInfo/getAllCustomer";

export default function CustomerManagementPage() {
  const [data, setData] = useState<Customer[]>([]);
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
            const rawCustomerData = await response.json();

            if (rawCustomerData && rawCustomerData.result) {
                const processedData: Customer[] = rawCustomerData.result.map((item: any) => ({
                    id: item.CUSTOMER_CD,
                    customerUserCode: item.CUSTOMER_USER_CD || "",
                    customerType: item.CUSTOMER_TYPE || "",
                    categoryCode: item.CATEGORY_CD || null,
                    categoryNameKor: item.CATEGORY_NAME_KOR || null,
                    categoryNameEng: item.CATEGORY_NAME_ENG || null,
                    categoryNameViet: item.CATEGORY_NAME_VIET || null,
                    customerTypeNameKor: item.CUSTOMER_TYPE_NAME_KOR || "",
                    customerTypeNameEng: item.CUSTOMER_TYPE_NAME_ENG || "",
                    customerTypeNameViet: item.CUSTOMER_TYPE_NAME_VIET || "",
                    nameVi: item.CUSTOMER_NM || "",
                    nameEn: item.CUSTOMER_NM_EN || "",
                    nameKo: item.CUSTOMER_NM_KOR || "",
                    buyerName: item.BUYER_NM || "", // NEW
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
                    createdDate: new Date().toISOString().split("T")[0], // Generate a mock createdDate
                }));
                setData(processedData);
            }
        } catch (error) {
            console.error("Failed to fetch customer data:", error);
        } finally {
            setIsInitialLoading(false); // Set loading state to false after fetch completes
        }
    };

    fetchData();
  }, []);

  const handleImport = useCallback((rows: any[], method: "add" | "update" | "overwrite") => {
    console.log("Import customer data:", rows, "Method:", method);
  }, []);

  const handlePrint = useCallback((lang: "vi" | "en" | "ko") => {
    console.log("Print customer list in language:", lang);
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
        const rawCustomerData = await response.json();

        if (rawCustomerData && rawCustomerData.result) {
          const refreshedData: Customer[] = rawCustomerData.result.map((item: any) => ({
            id: item.CUSTOMER_CD,
            customerUserCode: item.CUSTOMER_USER_CD || "",
            customerType: item.CUSTOMER_TYPE || "",
            categoryCode: item.CATEGORY_CD || null,
            categoryNameKor: item.CATEGORY_NAME_KOR || null,
            categoryNameEng: item.CATEGORY_NAME_ENG || null,
            categoryNameViet: item.CATEGORY_NAME_VIET || null,
            customerTypeNameKor: item.CUSTOMER_TYPE_NAME_KOR || "",
            customerTypeNameEng: item.CUSTOMER_TYPE_NAME_ENG || "",
            customerTypeNameViet: item.CUSTOMER_TYPE_NAME_VIET || "",
            nameVi: item.CUSTOMER_NM || "",
            nameEn: item.CUSTOMER_NM_EN || "",
            nameKo: item.CUSTOMER_NM_KOR || "",
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
        console.error("Failed to refresh customer data:", error);
      }
    };

    fetchData();
  }, []);
  const handleAdd = useCallback(async (newItem: Customer) => {
    try {
      const result = await addCustomerAPI(newItem)
      if (result && result.success) {
        setIsEditLoading(true)
        // Nếu thành công, có thể lấy dữ liệu mới từ result.data nếu API trả về
        // setData((prev) => [result.data ? result.data : newItem, ...prev])
        await handleRefresh() // Tải lại dữ liệu sau khi thêm thành công
        setIsEditLoading(false)
        return { success: true, message: result.message || "Thêm mới khách hàng thành công!" }
      } else {
        return { success: false, message: result?.message || "Thêm mới khách hàng thất bại!" }
      }
    } catch (error) {
      console.error("Failed to add customer:", error)
      return { success: false, message: "Thêm mới khách hàng thất bại!" }
    }
  }, [handleRefresh])

  // Add handleDelete for customer, same logic as material group
  const handleDelete = useCallback(async (id: string) => {
    setIsEditLoading(true);
    let result;
    try {
      // You need to import deleteCustomerAPI from your API file
      result = await import("@/api/customerApi").then(mod => mod.deleteCustomerAPI(id));
      console.log("API deleteCustomerAPI result:", result);
    } catch (error) {
      console.error("Failed to delete customer:", error);
      result = { success: false, message: "Xóa khách hàng thất bại!" };
    }
    await handleRefresh();
    setIsEditLoading(false);
    if (result && result.success) {
      return { success: true, message: result.message || "Xóa khách hàng thành công!" };
    } else {
      return { success: false, message: result?.message || "Xóa khách hàng thất bại!" };
    }
  }, [handleRefresh]);
  const handleEdit = useCallback(async (updatedItem: Customer) => {
    setIsEditLoading(true)
    try {
      const result = await updateCustomerAPI(updatedItem);
      if (result.success) {
        await handleRefresh();
        setIsEditLoading(false)
        return { success: true, message: result.message || "Cập nhật khách hàng thành công!" };
      } else {
        setIsEditLoading(false)
        return { success: false, message: result.message || "Cập nhật khách hàng thất bại!" };
      }
    } catch (error) {
      setIsEditLoading(false)
      console.error("Failed to edit customer:", error);
      return { success: false, message: "Cập nhật khách hàng thất bại!" };
    }
  }, [handleRefresh])
  
  const handleExport = useCallback(() => {
    exportToExcel(data, customerColumns, "danh-sach-khach-hang.xlsx", "KhachHang");
    alert("Đã xuất dữ liệu khách hàng ra Excel thành công!");
  }, [data]);

  return (
    <TablePage
      title="Quản lý khách hàng"
      description="Quản lý danh sách thông tin khách hàng"
      columns={customerColumns}
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
      excelImportConfig={customerImportConfig}
      printConfig={customerPrintConfig}
      FormModalComponent={CustomerFormModal}
      deleteConfig={customerDeleteConfig}
      bulkDeleteConfig={customerBulkDeleteConfig}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onEdit={handleEdit}
    />
  );
}