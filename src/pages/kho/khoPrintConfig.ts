import type { PrintConfig } from "@/types/modal"

export const khoPrintConfig: PrintConfig = {
  title: {
    vi: "DANH SÁCH SẢN PHẨM KHO HÀNG",
    en: "WAREHOUSE PRODUCT LIST",
    ko: "창고 제품 목록",
  },
  columns: {
    PRODUCT_CD: { vi: "Mã sản phẩm", en: "Product Code", ko: "제품 코드" },
    DivisionCD: { vi: "Mã bộ phận", en: "Division Code", ko: "부서 코드" },
    PRODUCTKIND_CD: { vi: "Mã loại sản phẩm", en: "Product Kind Code", ko: "제품 종류 코드" },
    DepartmentCD: { vi: "Mã phòng ban", en: "Department Code", ko: "부서 코드" },
    PRODUCT_NM: { vi: "Tên sản phẩm (VI)", en: "Product Name (Vietnamese)", ko: "제품명 (베트남어)" },
    PRODUCT_NM_ENG: { vi: "Tên sản phẩm (EN)", en: "Product Name (English)", ko: "제품명 (영어)" },
    PRODUCT_NM_KOR: { vi: "Tên sản phẩm (KO)", en: "Product Name (Korean)", ko: "제품명 (한국어)" },
    InboundUnitCD: { vi: "Đơn vị nhập kho", en: "Inbound Unit", ko: "입고 단위" },
    OutboundUnitCD: { vi: "Đơn vị xuất kho", en: "Outbound Unit", ko: "출고 단위" },
    materialInputUnitCD: { vi: "Đơn vị nhập NVL", en: "Material Input Unit", ko: "자재입고 단위" },
    StockUnitCD: { vi: "Đơn vị tồn kho", en: "Stock Unit", ko: "재고 단위" },
    InboundQuantity: { vi: "Số lượng nhập kho", en: "Inbound Quantity", ko: "입고 수량" },
    OutboundQuantity: { vi: "Số lượng xuất kho", en: "Outbound Quantity", ko: "출고 수량" },
    MaterialInputQuantity: { vi: "Số lượng nhập NVL", en: "Material Input Quantity", ko: "자재입고 수량" },
    StoreCD: { vi: "Mã kho lưu trữ", en: "Store Code", ko: "창고 코드" },
    StandardCD: { vi: "Mã tiêu chuẩn", en: "Standard Code", ko: "표준 코드" },
    FitnessStock: { vi: "Tồn kho khả dụng", en: "Fitness Stock", ko: "가용 재고" },
    UnitPrice: { vi: "Đơn giá", en: "Unit Price", ko: "단가" },
    FcUnitPirce: { vi: "Đơn giá ngoại tệ", en: "Foreign Currency Price", ko: "외화 단가" },
    ExRate: { vi: "Tỷ giá", en: "Exchange Rate", ko: "환율" },
    lblCCType: { vi: "Loại CC", en: "CC Type", ko: "CC 유형" },
    lblFCType: { vi: "Loại ngoại tệ", en: "Foreign Currency Type", ko: "외화 유형" },
    txtSummary: { vi: "Ghi chú", en: "Summary", ko: "요약" },
    rgUseNotUse: { vi: "Sử dụng/Không sử dụng", en: "Use/Not Use", ko: "사용/미사용" },
    HaveChildBOM: { vi: "Có BOM con", en: "Has Child BOM", ko: "하위 BOM 있음" },
    Origin: { vi: "Xuất xứ", en: "Origin", ko: "원산지" },
  },
  translations: {
    vi: {
      title: "DANH SÁCH SẢN PHẨM KHO HÀNG",
      printDate: "Ngày in",
      columns: { stt: "STT" },
      footer: {
        preparedBy: "Người lập biểu",
        accountant: "Kế toán trưởng",
        director: "Giám đốc",
        signature: "(Ký họ tên)",
        date: "Ngày ... tháng ... năm ...",
      },
      summary: "Tổng cộng có {count} sản phẩm kho hàng",
    },
    en: {
      title: "WAREHOUSE PRODUCT LIST",
      printDate: "Print Date",
      columns: { stt: "No." },
      footer: {
        preparedBy: "Prepared by",
        accountant: "Chief Accountant",
        director: "Director",
        signature: "(Signature)",
        date: "Date ... Month ... Year ...",
      },
      summary: "Total: {count} warehouse products",
    },
    ko: {
      title: "창고 제품 목록",
      printDate: "인쇄 날짜",
      columns: { stt: "번호" },
      footer: {
        preparedBy: "작성자",
        accountant: "회계 책임자",
        director: "이사",
        signature: "(서명)",
        date: "날짜 ... 월 ... 년 ...",
      },
      summary: "총 {count}개의 창고 제품",
    },
  },
}
