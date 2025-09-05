import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-content">
      <div className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Welcome to ETechFE</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Quản lý đơn hàng nhanh chóng và trực quan
            </h1>
            <p className="mt-4 text-base-content/70">
              Tạo, xem và theo dõi đơn hàng theo thời gian thực. Bắt đầu ngay với giao diện hiện đại dựa trên DaisyUI.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link to="/create-order" className="btn btn-primary">
                Tạo đơn hàng
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                Mở Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Dễ sử dụng</h2>
              <p>Thiết kế tối giản, thao tác nhanh, làm việc hiệu quả hơn.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Bảo mật</h2>
              <p>Dữ liệu được bảo vệ và đồng bộ an toàn.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Tùy biến</h2>
              <p>Dễ dàng mở rộng và tích hợp theo nhu cầu của bạn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
