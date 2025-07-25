import type { MaterialKind } from "@/types/material";
import { login } from "@/lib/login";

const API_BASE_URL = "http://118.69.170.50/API/api";
const API_LIST = `${API_BASE_URL}/ProductKind/getAllProductKind`;
const API_ADD = `${API_BASE_URL}/ProductKind/insert`;
const API_EDIT = `${API_BASE_URL}/ProductKind/update`;
const API_DELETE = `${API_BASE_URL}/ProductKind/delete`;

function mapMaterialGroupToApiFormat(material: MaterialKind): any {
  return {
    Lag: "VIET",
    PRODUCTKIND_CD: material.PRODUCTKIND_CD,
    PRODUCTKIND_NM: material.PRODUCTKIND_NM,
    PRODUCTKIND_NM_ENG: material.PRODUCTKIND_NM_ENG,
    PRODUCTKIND_NM_KOR: material.PRODUCTKIND_NM_KOR,
    REMARK: material.REMARK,
    COUNT: material.COUNT,
  };
}

export async function getMaterialGroupList() {
  const token = await login("ameinvoice", "amnote123", "2736", "VIET");
  const response = await fetch(API_LIST, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function addMaterialGroupAPI(newMaterial: MaterialKind) {
  const token = await login("ameinvoice", "amnote123", "2736", "VIET");
  const apiData = mapMaterialGroupToApiFormat(newMaterial);
  const response = await fetch(API_ADD, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(apiData),
  });
  return response.json();
}

export async function updateMaterialGroupAPI(updatedMaterial: MaterialKind) {
  const token = await login("ameinvoice", "amnote123", "2736", "VIET");
  const apiData = mapMaterialGroupToApiFormat(updatedMaterial);
  const response = await fetch(API_EDIT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(apiData),
  });
  return response.json();
}

export async function deleteMaterialGroupAPI(id: string) {
  const token = await login("ameinvoice", "amnote123", "2736", "VIET");
  const response = await fetch(API_DELETE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ Lag: "VIET", PRODUCTKIND_CD: id }),
  });
  return response.json();
}
