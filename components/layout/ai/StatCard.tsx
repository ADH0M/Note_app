import { LucideIcon } from "lucide-react";

type PropType = {
  icon: LucideIcon;
  label:string;
  value:number| string;
  change:string;
};

export function StatCard({ icon: Icon, label, value, change }: PropType) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{change}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
