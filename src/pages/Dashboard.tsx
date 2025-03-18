import { TempEmailManager } from "@/components/TempEmailManager";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="mb-8">
        <TempEmailManager />
      </div>
    </div>
  );
}
