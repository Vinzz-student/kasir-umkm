import Sidebar from "@/components/seller/sidebar";
import SellerHeader from "@/components/seller/header";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <SellerHeader />
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
