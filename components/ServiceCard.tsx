export default function ServiceCard({ title, description, icon }: { title: string; description: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-primary">{icon}</div>
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{description}</div>
        </div>
      </div>
    </div>
  );
}
