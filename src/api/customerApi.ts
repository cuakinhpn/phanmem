"use server"

import type { Customer } from "@/types/customer"
import { login } from "@/lib/login"

// --- Cấu hình API ---
const API_BASE_URL = "http://118.69.170.50/API/api"
const API_ADD_CUSTOMER = `${API_BASE_URL}/CustomerInfo/insert`
const API_UPDATE_CUSTOMER = `${API_BASE_URL}/CustomerInfo/update`

// --- Hàm trợ giúp để ánh xạ Customer interface sang định dạng API mong muốn ---
function mapCustomerToApiFormat(customer: Customer): any {
  const apiData: any = {
    Lag: "VIET",
    CategoryCD: customer.categoryCode,
    CustomerType: customer.customerType,
    CustomerNM: customer.nameVi,
    CustomerNM_EN: customer.nameEn,
    CustomerNM_KOR: customer.nameKo,
    BuyerNM: customer.buyerName,
    CustomerUserCD: customer.customerUserCode,
    TaxCD: customer.taxCode,
    BankCD: "", // Assuming this is always empty or handled differently
    OwnerNM: customer.ownerName,
    BusinessType: customer.businessType,
    KindBusiness: customer.kindBusiness,
    Tel: customer.tel,
    Fax: customer.fax,
    ZipCD: customer.zipCode,
    Address: customer.address,
    Email: customer.email,
    // Các trường khác từ Customer interface không có trong JSON mẫu của bạn
    // hoặc không cần gửi lên API sẽ không được đưa vào đây.
    // Ví dụ: createdDate, categoryNameKor, customerTypeNameKor, v.v.
  }

  // Chỉ bao gồm CustomerCD nếu customer.id có giá trị (tức là không phải chuỗi rỗng)
  // Điều này đảm bảo rằng khi thêm mới (id rỗng), trường này sẽ không được gửi lên,
  // cho phép API tự động tạo mã. Khi cập nhật, id sẽ có giá trị và được gửi đi.
  if (customer.id) {
    apiData.CustomerCD = customer.id
  }

  return apiData
}

// --- Server Action để thêm khách hàng mới ---
export async function addCustomerAPI(newCustomer: Customer) {
  try {
    // Lấy token xác thực từ login trong lib
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")

    // Ánh xạ dữ liệu khách hàng sang định dạng API
    const apiData = mapCustomerToApiFormat(newCustomer)

    console.log("Đang gửi yêu cầu thêm khách hàng đến API:", API_ADD_CUSTOMER, "Dữ liệu:", apiData)

    const response = await fetch(API_ADD_CUSTOMER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json()
    console.log("Phản hồi JSON từ API (thêm khách hàng):", result)

    if (!response.ok) {
      alert(result.messages?.[0] || result.message || "Thêm khách hàng thất bại!")
      throw new Error(
        `Lỗi API khi thêm khách hàng: ${response.status} - ${result.messages?.[0] || result.message || JSON.stringify(result)}`,
      )
    }

    if (result.status === "success") {
      alert(result.messages?.[0] || "Thêm khách hàng thành công!")
      return { success: true, message: result.messages?.[0] || "Thêm khách hàng thành công!", data: result.result }
    } else {
      alert(result.messages?.[0] || "Thêm khách hàng thất bại!")
      throw new Error(result.messages?.[0] || "Thêm khách hàng thất bại.")
    }
  } catch (error: any) {
    console.error("Lỗi trong addCustomerAction:", error)
    alert(error.message || "Đã xảy ra lỗi khi thêm khách hàng.")
    return { success: false, message: error.message || "Đã xảy ra lỗi khi thêm khách hàng." }
  }
}

// --- Server Action để cập nhật khách hàng ---
export async function updateCustomerAPI(updatedCustomer: Customer) {
  try {
    // Lấy token xác thực
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")

    // Ánh xạ dữ liệu khách hàng sang định dạng API
    const apiData = mapCustomerToApiFormat(updatedCustomer)

    // Đảm bảo CustomerCD phải có mặt cho các thao tác cập nhật
    if (!apiData.CustomerCD) {
      throw new Error("Không tìm thấy Mã khách hàng (CustomerCD) để cập nhật.")
    }

    console.log("Đang gửi yêu cầu cập nhật khách hàng đến API:", API_UPDATE_CUSTOMER, "Dữ liệu:", apiData)

    const response = await fetch(API_UPDATE_CUSTOMER, {
      method: "POST", // Sửa thành PUT vì cập nhật thường dùng PUT
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json() // Lấy phản hồi JSON từ API
    console.log("Phản hồi JSON từ API (cập nhật khách hàng):", result) // Log phản hồi JSON

    if (!response.ok) {
      // Nếu response.ok là false, tức là có lỗi HTTP (ví dụ: 4xx, 5xx)
      throw new Error(
        `Lỗi API khi cập nhật khách hàng: ${response.status} - ${result.messages?.[0] || result.message || JSON.stringify(result)}`,
      )
    }

    if (result.status === "success") {
      alert(result.messages?.[0] || "Cập nhật khách hàng thành công!") // Thêm thông báo thành công
      return { success: true, message: result.messages?.[0] || "Cập nhật khách hàng thành công!", data: result.result }
    } else {
      // Nếu API trả về status không phải 'success' nhưng response.ok là true (ví dụ: lỗi nghiệp vụ 200 OK)
      throw new Error(result.messages?.[0] || "Cập nhật khách hàng thất bại.")
    }
  } catch (error: any) {
    console.error("Lỗi trong updateCustomerAction:", error)
    alert(error.message || "Đã xảy ra lỗi khi cập nhật khách hàng.") // Thêm thông báo lỗi
    return { success: false, message: error.message || "Đã xảy ra lỗi khi cập nhật khách hàng." }
  }
}

// --- Server Action để xóa khách hàng ---
export async function deleteCustomerAPI(customerId: string) {
  try {
    // Lấy token xác thực
    const token = await login("ameinvoice", "amnote123", "2736", "VIET")

    // Dữ liệu gửi lên API
    const apiData = {
      Lag: "VIET",
      CustomerCD: customerId,
    }

    console.log("Đang gửi yêu cầu xóa khách hàng đến API:", "http://118.69.170.50/API/api/CustomerInfo/delete", "Dữ liệu:", apiData)

    const response = await fetch("http://118.69.170.50/API/api/CustomerInfo/delete", {
      method: "POST", // API sử dụng phương thức POST để xóa
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json() // Lấy phản hồi JSON từ API
    console.log("Phản hồi JSON từ API (xóa khách hàng):", result) // Log phản hồi JSON

    if (!response.ok) {
      // Nếu response.ok là false, tức là có lỗi HTTP (ví dụ: 4xx, 5xx)
      throw new Error(
        `Lỗi API khi xóa khách hàng: ${response.status} - ${result.messages?.[0] || result.message || JSON.stringify(result)}`,
      )
    }

    if (result.status === "success") {
      alert(result.messages?.[0] || "Xóa khách hàng thành công!") // Thông báo thành công
      return { success: true, message: result.messages?.[0] || "Xóa khách hàng thành công!" }
    } else {
      // Nếu API trả về status không phải 'success' nhưng response.ok là true (ví dụ: lỗi nghiệp vụ 200 OK)
      throw new Error(result.messages?.[0] || "Xóa khách hàng thất bại.")
    }
  } catch (error: any) {
    console.error("Lỗi trong deleteCustomerAPI:", error)
    alert(error.message || "Đã xảy ra lỗi khi xóa khách hàng.") // Thông báo lỗi
    return { success: false, message: error.message || "Đã xảy ra lỗi khi xóa khách hàng." }
  }
}
