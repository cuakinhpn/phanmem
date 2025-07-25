import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, FileText, ChevronRight, Receipt, Wallet, FileMinus2, FilePlus2, ShoppingCart, Handshake, ArrowLeftRight, Layers, Lock } from "lucide-react";

const summarySubMenus = [
  {
    id: "documents",
    title: "Chứng từ",
    icon: <FileText size={32} />,
    slug: "/documents",
    description: "Quản lý chứng từ kế toán, phiếu thu chi, mua bán...",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "receipt",
    title: "Phiếu thu",
    icon: <Receipt size={32} />,
    slug: "/receipt",
    description: "Quản lý phiếu thu tiền mặt, ngân hàng...",
    color: "from-green-500 to-green-600",
  },
  {
    id: "payment",
    title: "Phiếu chi",
    icon: <Wallet size={32} />,
    slug: "/payment",
    description: "Quản lý phiếu chi tiền mặt, ngân hàng...",
    color: "from-red-500 to-red-600",
  },
  {
    id: "debt-note",
    title: "Giấy báo nợ",
    icon: <FileMinus2 size={32} />,
    slug: "/debt-note",
    description: "Quản lý giấy báo nợ ngân hàng...",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: "credit-note",
    title: "Giấy báo có",
    icon: <FilePlus2 size={32} />,
    slug: "/credit-note",
    description: "Quản lý giấy báo có ngân hàng...",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id: "purchase-order",
    title: "Phiếu mua hàng",
    icon: <ShoppingCart size={32} />,
    slug: "/purchase-order",
    description: "Quản lý phiếu mua hàng hóa, dịch vụ...",
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "service-order",
    title: "Phiếu mua dịch vụ",
    icon: <Handshake size={32} />,
    slug: "/service-order",
    description: "Quản lý phiếu mua dịch vụ...",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "sales-order",
    title: "Phiếu bán hàng/dịch vụ",
    icon: <ShoppingCart size={32} />,
    slug: "/sales-order",
    description: "Quản lý phiếu bán hàng, bán dịch vụ...",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "offset-order",
    title: "Phiếu cấn trừ",
    icon: <ArrowLeftRight size={32} />,
    slug: "/offset-order",
    description: "Quản lý phiếu cấn trừ công nợ...",
    color: "from-lime-500 to-lime-600",
  },
  {
    id: "other-order",
    title: "Phiếu khác",
    icon: <Layers size={32} />,
    slug: "/other-order",
    description: "Quản lý các loại phiếu khác...",
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "opening-balance",
    title: "Sổ đầu kỳ được chuyển sang",
    icon: <BarChart3 size={32} />,
    slug: "/opening-balance",
    description: "Quản lý số dư đầu kỳ chuyển sang...",
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "transfer",
    title: "Kết chuyển",
    icon: <BarChart3 size={32} />,
    slug: "/transfer",
    description: "Quản lý kết chuyển cuối kỳ...",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "check-transfer",
    title: "Kiểm tra kết chuyển tài khoản trước khi khóa sổ",
    icon: <BarChart3 size={32} />,
    slug: "/check-transfer",
    description: "Kiểm tra kết chuyển tài khoản trước khi khóa sổ...",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "lock",
    title: "Khóa sổ",
    icon: <Lock size={32} />,
    slug: "/lock",
    description: "Khóa sổ kế toán cuối kỳ...",
    color: "from-rose-500 to-rose-600",
  },
];

export default function SummaryPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tổng hợp</h1>
            <p className="text-gray-600 mt-2">Danh sách các chức năng tổng hợp nghiệp vụ kế toán</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {summarySubMenus.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.slug)}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
          >
            {/* Icon với nền gradient riêng từng menu */}
            <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <div className="text-white">
                {item.icon}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">Nhấn để truy cập</span>
              <ChevronRight
                size={16}
                className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
