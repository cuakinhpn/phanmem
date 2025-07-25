"use server"

import type { Kho } from "../types/kho"
import { login } from "@/lib/login"

// --- Cấu hình API ---
const API_BASE_URL = "http://118.69.170.50/API/api"
const API_ADD_KHO = `${API_BASE_URL}/ProductInfo/insert`
const API_UPDATE_KHO = `${API_BASE_URL}/ProductInfo/update`
const API_DELETE_KHO = `${API_BASE_URL}/ProductInfo/delete`

// --- Hàm ánh xạ Kho sang định dạng API ---
function mapKhoToApiFormat(kho: Kho): any {
  return {
    Lag: "VIET", // luôn cố định
    PRODUCT_CD: kho.PRODUCT_CD,
    DivisionCD: kho.DivisionCD,
    PRODUCTKIND_CD: kho.PRODUCTKIND_CD,
    DepartmentCD: kho.DepartmentCD,
    PRODUCT_NM: kho.PRODUCT_NM,
    PRODUCT_NM_ENG: kho.PRODUCT_NM_ENG,
    PRODUCT_NM_KOR: kho.PRODUCT_NM_KOR,
    InboundUnitCD: kho.InboundUnitCD,
    OutboundUnitCD: kho.OutboundUnitCD,
    materialInputUnitCD: kho.materialInputUnitCD,
    StockUnitCD: kho.StockUnitCD,
    InboundQuantity: kho.InboundQuantity,
    OutboundQuantity: kho.OutboundQuantity,
    MaterialInputQuantity: kho.MaterialInputQuantity,
    StoreCD: kho.StoreCD,
    StandardCD: kho.StandardCD,
    FitnessStock: kho.FitnessStock,
    UnitPrice: kho.UnitPrice,
    FcUnitPirce: kho.FcUnitPirce,
    ExRate: kho.ExRate,
    lblCCType: kho.lblCCType,
    lblFCType: kho.lblFCType,
    txtSummary: kho.txtSummary,
    rgUseNotUse: kho.rgUseNotUse,
    HaveChildBOM: kho.HaveChildBOM,
    Origin: kho.Origin,
  }
}

// --- Thêm sản phẩm kho ---
export async function addKhoAPI(newKho: Kho) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")
    const apiData = mapKhoToApiFormat(newKho)
    const response = await fetch(API_ADD_KHO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.messages?.[0] || result.message || "Thêm sản phẩm kho thất bại!")
    }
    if (result.status === "success") {
      return { success: true, message: result.messages?.[0] || "Thêm sản phẩm kho thành công!", data: result.result }
    } else {
      throw new Error(result.messages?.[0] || "Thêm sản phẩm kho thất bại.")
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Đã xảy ra lỗi khi thêm sản phẩm kho." }
  }
}

// --- Cập nhật sản phẩm kho ---
export async function updateKhoAPI(updatedKho: Kho) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")
    const apiData = mapKhoToApiFormat(updatedKho)
    if (!apiData.PRODUCT_CD) {
      throw new Error("Không tìm thấy Mã sản phẩm (PRODUCT_CD) để cập nhật.")
    }
    const response = await fetch(API_UPDATE_KHO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.messages?.[0] || result.message || "Cập nhật sản phẩm kho thất bại!")
    }
    if (result.status === "success") {
      return { success: true, message: result.messages?.[0] || "Cập nhật sản phẩm kho thành công!", data: result.result }
    } else {
      throw new Error(result.messages?.[0] || "Cập nhật sản phẩm kho thất bại.")
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Đã xảy ra lỗi khi cập nhật sản phẩm kho." }
  }
}

// --- Xóa sản phẩm kho ---
export async function deleteKhoAPI(productCode: string) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")
    const apiData = { Lag: "VIET", PRODUCT_CD: productCode }
    const response = await fetch(API_DELETE_KHO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.messages?.[0] || result.message || "Xóa sản phẩm kho thất bại!")
    }
    if (result.status === "success") {
      return { success: true, message: result.messages?.[0] || "Xóa sản phẩm kho thành công!" }
    } else {
      throw new Error(result.messages?.[0] || "Xóa sản phẩm kho thất bại.")
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Đã xảy ra lỗi khi xóa sản phẩm kho." }
  }
}
