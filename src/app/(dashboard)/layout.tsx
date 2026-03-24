export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar/nav will go here */}
      <main>{children}</main>
    </div>
  );
}
