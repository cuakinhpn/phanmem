"use server"

import type { UnitManagement } from "@/types/unitmanagement"
import { login } from "@/lib/login"

// --- Cấu hình API ---
const API_BASE_URL = "http://118.69.170.50/API/api"
const API_GET_ALL_UNIT = `${API_BASE_URL}/ProductUnitInfo/getAll`
const API_ADD_UNIT = `${API_BASE_URL}/ProductUnitInfo/insert`
const API_UPDATE_UNIT = `${API_BASE_URL}/ProductUnitInfo/update`
const API_DELETE_UNIT = `${API_BASE_URL}/ProductUnitInfo/delete`

// --- Hàm ánh xạ dữ liệu sang định dạng API ---
function mapUnitToApiFormat(unit: UnitManagement): any {
  const apiData: any = {
    Lag: "VIET",
    UnitCD: unit.UNIT_CD,
    UnitNM: unit.UNIT_NM,
    IsDel: unit.ISDEL,
    UserID: unit.USERID,
  }
  // Nếu có UNIT_CD thì gửi lên cho update/xóa
  if (unit.UNIT_CD) {
    apiData.UnitCD = unit.UNIT_CD
  }
  return apiData
}

// --- Lấy danh sách đơn vị tính ---
export async function getAllUnitAPI() {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")
    const response = await fetch(API_GET_ALL_UNIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ Lag: "VIET" }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || "Lấy danh sách đơn vị tính thất bại!")
    return result.result || []
  } catch (error: any) {
    alert(error.message || "Lỗi khi lấy danh sách đơn vị tính!")
    return []
  }
}

// --- Thêm mới đơn vị tính ---
export async function addUnitAPI(newUnit: UnitManagement) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")
    const apiData = mapUnitToApiFormat(newUnit)
    const response = await fetch(API_ADD_UNIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || "Thêm đơn vị tính thất bại!")
    if (result.status === "success") {
      alert(result.messages?.[0] || "Thêm đơn vị tính thành công!")
      return { success: true, message: result.messages?.[0] || "Thêm đơn vị tính thành công!", data: result.result }
    } else {
      throw new Error(result.messages?.[0] || "Thêm đơn vị tính thất bại.")
    }
  } catch (error: any) {
    alert(error.message || "Lỗi khi thêm đơn vị tính!")
    return { success: false, message: error.message || "Lỗi khi thêm đơn vị tính!" }
  }
}

// --- Cập nhật đơn vị tính ---
export async function updateUnitAPI(updatedUnit: UnitManagement) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")
    const apiData = mapUnitToApiFormat(updatedUnit)
    if (!apiData.UnitCD) throw new Error("Không tìm thấy Mã đơn vị (UnitCD) để cập nhật.")
    const response = await fetch(API_UPDATE_UNIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || "Cập nhật đơn vị tính thất bại!")
    if (result.status === "success") {
      alert(result.messages?.[0] || "Cập nhật đơn vị tính thành công!")
      return { success: true, message: result.messages?.[0] || "Cập nhật đơn vị tính thành công!", data: result.result }
    } else {
      throw new Error(result.messages?.[0] || "Cập nhật đơn vị tính thất bại.")
    }
  } catch (error: any) {
    alert(error.message || "Lỗi khi cập nhật đơn vị tính!")
    return { success: false, message: error.message || "Lỗi khi cập nhật đơn vị tính!" }
  }
}

// --- Xóa đơn vị tính ---
export async function deleteUnitAPI(unitId: string) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")
    const apiData = { Lag: "VIET", UnitCD: unitId }
    const response = await fetch(API_DELETE_UNIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || "Xóa đơn vị tính thất bại!")
    if (result.status === "success") {
      alert(result.messages?.[0] || "Xóa đơn vị tính thành công!")
      return { success: true, message: result.messages?.[0] || "Xóa đơn vị tính thành công!" }
    } else {
      throw new Error(result.messages?.[0] || "Xóa đơn vị tính thất bại.")
    }
  } catch (error: any) {
    alert(error.message || "Lỗi khi xóa đơn vị tính!")
    return { success: false, message: error.message || "Lỗi khi xóa đơn vị tính!" }
  }
}
