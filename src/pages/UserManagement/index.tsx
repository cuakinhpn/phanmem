"use client"

import { useState, useCallback } from "react"
import { TablePage } from "@/components/table/TablePage"
import { userColumns } from "./userConfig"
import { userDeleteConfig, userBulkDeleteConfig } from "./userFormConfig"
import UserFormModal from "./UserFormModal"
import { exportToExcel } from "@/lib/excelUtils"
import type { User } from "@/types/user"

// Mock data generator
const generateUserData = (count: number): User[] => {
  const names = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E", "Vũ Thị F"]
  const costCenters = ["213", "214", "215", "216"]
  const permissions = ["admin", "user", "viewer"] as const
  const data: User[] = []

  for (let i = 1; i <= count; i++) {
    data.push({
      id: i.toString(),
      userId: `USER${i.toString().padStart(3, "0")}`,
      name: names[i % names.length],
      costCenterCode: costCenters[i % costCenters.length],
      permission: permissions[i % permissions.length],
      phone: `091${(4000000 + i).toString().slice(0, 7)}`,
      issueDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      notes: `Ghi chú cho người dùng ${i}`,
      shinhanOnline: Math.random() > 0.5,
      lockOption: Math.random() > 0.5 ? "can_lock" : "cannot_lock",
      cannotDeleteLinked: Math.random() > 0.5,
      cannotEditLocked: Math.random() > 0.5,
      cannotAddLock: Math.random() > 0.5,
      editReservedName: Math.random() > 0.5,
      showDocumentsByUser: Math.random() > 0.5,
      permissions: ["dashboard", "basic-data", "customer-management"],
      createdDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
    })
  }

  return data
}

export default function UserManagementPage() {
  const [data, setData] = useState<User[]>(() => generateUserData(100))

  const handleImport = useCallback(
    (rows: any[], method: "add" | "update" | "overwrite") => {
      console.log("Import user data:", rows, "Method:", method)
      if (method === "overwrite") {
        setData(
          rows.map((row, index) => ({
            ...row,
            id: (index + 1).toString(),
            createdDate: new Date().toISOString().split("T")[0],
          })),
        )
      } else if (method === "add") {
        const newItems = rows.map((row, index) => ({
          ...row,
          id: (data.length + index + 1).toString(),
          createdDate: new Date().toISOString().split("T")[0],
        }))
        setData((prev) => [...prev, ...newItems])
      } else if (method === "update") {
        setData((prev) => {
          const updated = [...prev]
          rows.forEach((row) => {
            const index = updated.findIndex((item) => item.userId === row.userId)
            if (index !== -1) {
              updated[index] = { ...updated[index], ...row }
            }
          })
          return updated
        })
      }
    },
    [data.length],
  )

  const handlePrint = useCallback((lang: "vi" | "en" | "ko") => {
    console.log("Print user list in language:", lang)
  }, [])

  const handleAdd = useCallback(async (newItem: User) => {
    try {
      const userWithId = {
        ...newItem,
        id: (data.length + 1).toString(),
        createdDate: new Date().toISOString().split("T")[0],
      }
      setData((prev) => [...prev, userWithId])
      return { success: true, message: "Thêm mới người dùng thành công!" }
    } catch (error) {
      console.error("Failed to add user:", error)
      return { success: false, message: "Thêm mới người dùng thất bại!" }
    }
  }, [data.length])

  const handleEdit = useCallback(async (updatedItem: User) => {
    try {
      setData((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
      return { success: true, message: "Cập nhật người dùng thành công!" }
    } catch (error) {
      console.error("Failed to edit user:", error)
      return { success: false, message: "Cập nhật người dùng thất bại!" }
    }
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    try {
      setData((prev) => prev.filter((item) => item.id !== id))
      return { success: true, message: "Xóa người dùng thành công!" }
    } catch (error) {
      console.error("Failed to delete user:", error)
      return { success: false, message: "Xóa người dùng thất bại!" }
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setData(generateUserData(100))
  }, [])

  const handleExport = useCallback(() => {
    exportToExcel(data, userColumns, "danh-sach-nguoi-dung.xlsx", "NguoiDung")
    alert("Đã xuất dữ liệu người dùng ra Excel thành công!")
  }, [data])

  // Custom cell renderer for permission and shinhanOnline
  const renderCustomCell = useCallback((item: User, column: any) => {
    if (column.dataField === "permission") {
      const permissionLabels = {
        admin: "Quản trị cao nhất",
        user: "Người sử dụng",
        viewer: "Người xem"
      }
      const colors = {
        admin: "bg-red-100 text-red-800",
        user: "bg-blue-100 text-blue-800",
        viewer: "bg-gray-100 text-gray-800"
      }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[item.permission]}`}>
          {permissionLabels[item.permission]}
        </span>
      )
    }
    
    if (column.dataField === "shinhanOnline") {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.shinhanOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}>
          {item.shinhanOnline ? "Có" : "Không"}
        </span>
      )
    }

    return null
  }, [])

  return (
    <TablePage
      title="Quản lý người dùng"
      description="Quản lý danh sách người dùng hệ thống"
      columns={userColumns}
      data={data}
      onImport={handleImport}
      onPrint={handlePrint}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      onExport={handleExport}
      searchFields={["userId", "name", "costCenterCode", "phone", "notes"]}
      enableTreeView={false}
      companyInfo={{
        name: "Công ty TNHH ABC Technology",
        address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
        taxCode: "0123456789",
      }}
      FormModalComponent={UserFormModal}
      deleteConfig={userDeleteConfig}
      bulkDeleteConfig={userBulkDeleteConfig}
      renderCustomCell={renderCustomCell}
    />
  )
}