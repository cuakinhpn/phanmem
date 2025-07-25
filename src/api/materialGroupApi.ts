
import type { MaterialKind } from "@/types/material";

import { login } from "@/lib/login";
const API_BASE_URL = "http://118.69.170.50/API/api";
const API_ADD_MATERIAL_GROUP = `${API_BASE_URL}/ProductKind/insert`;
const API_UPDATE_MATERIAL_GROUP = `${API_BASE_URL}/ProductKind/update`;

function mapMaterialGroupToApiFormat(material: MaterialKind): any {
  const apiData: any = {
    Lag: "VIET",
    PRODUCTKIND_CD: material.PRODUCTKIND_CD,
    PRODUCTKIND_NM: material.PRODUCTKIND_NM,
    PRODUCTKIND_NM_ENG: material.PRODUCTKIND_NM_ENG,
    PRODUCTKIND_NM_KOR: material.PRODUCTKIND_NM_KOR,
    REMARK: material.REMARK,
    COUNT: material.COUNT,
  };
  if (material.id) {
    apiData.PRODUCTKIND_CD = material.id;
  }
  return apiData;
}

export async function addMaterialGroupAPI(newMaterial: MaterialKind) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET");
    const apiData = mapMaterialGroupToApiFormat(newMaterial);
    const response = await fetch(API_ADD_MATERIAL_GROUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    });
    const result = await response.json();
    console.log("API response for updateMaterialGroupAPI:", result);
    if (!response.ok) {
      throw new Error(result.messages?.[0] || result.message || "Thêm nhóm vật tư thất bại!");
    }
    if (result.status === "success") {
      return { success: true, message: result.messages?.[0] || "Thêm nhóm vật tư thành công!", data: result.result };
    } else {
      throw new Error(result.messages?.[0] || "Thêm nhóm vật tư thất bại.");
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Đã xảy ra lỗi khi thêm nhóm vật tư." };
  }
}

export async function updateMaterialGroupAPI(updatedMaterial: MaterialKind) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET");
    const apiData = mapMaterialGroupToApiFormat(updatedMaterial);
    if (!apiData.PRODUCTKIND_CD) {
      throw new Error("Không tìm thấy Mã nhóm vật tư (PRODUCTKIND_CD) để cập nhật.");
    }
    const response = await fetch(API_UPDATE_MATERIAL_GROUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.messages?.[0] || result.message || "Cập nhật nhóm vật tư thất bại!");
    }
    if (result.status === "success") {
      return { success: true, message: result.messages?.[0] || "Cập nhật nhóm vật tư thành công!", data: result.result };
    } else {
      throw new Error(result.messages?.[0] || "Cập nhật nhóm vật tư thất bại.");
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Đã xảy ra lỗi khi cập nhật nhóm vật tư." };
  }
}

// --- Server Action để xóa khách hàng ---
export async function deleteMaterialGroupAPI(materialGroupId: string) {
  try {
    const token = await login("ameinvoice", "amnote123", "2736", "VIET");
    const apiData = {
      Lag: "VIET",
      PRODUCTKIND_CD: materialGroupId,
    };
    console.log("Đang gửi yêu cầu xóa nhóm vật tư đến API:", "http://118.69.170.50/API/api/ProductKind/delete", "Dữ liệu:", apiData);
    const response = await fetch("http://118.69.170.50/API/api/ProductKind/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    });
    const result = await response.json();
    console.log("Phản hồi JSON từ API (xóa nhóm vật tư):", result);
    if (!response.ok) {
      throw new Error(`Lỗi API khi xóa nhóm vật tư: ${response.status} - ${result.messages?.[0] || result.message || JSON.stringify(result)}`);
    }
    if (result.status === "success") {
      alert(result.messages?.[0] || "Xóa nhóm vật tư thành công!");
      return { success: true, message: result.messages?.[0] || "Xóa nhóm vật tư thành công!" };
    } else {
      throw new Error(result.messages?.[0] || "Xóa nhóm vật tư thất bại.");
    }
  } catch (error: any) {
    console.error("Lỗi trong deleteMaterialGroupAPI:", error);
    alert(error.message || "Đã xảy ra lỗi khi xóa nhóm vật tư.");
    return { success: false, message: error.message || "Đã xảy ra lỗi khi xóa nhóm vật tư." };
  }
}
