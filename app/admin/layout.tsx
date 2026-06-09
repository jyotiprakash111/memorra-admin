import { AdminLayout } from "@/src/components/shared/AdminLayout"

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
