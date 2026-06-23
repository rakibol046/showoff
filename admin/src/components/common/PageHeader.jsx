import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PageHeader({ title, subtitle, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {(actionLabel && (actionTo || onAction)) && (
        actionTo ? (
          <Link to={actionTo}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="gap-2">
            <Plus className="w-4 h-4" />
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
