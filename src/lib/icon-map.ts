import {
  Building2,
  Factory,
  Wrench,
  Zap,
  ShieldCheck,
  Hammer,
  Cog,
  Package,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Building2,
  Factory,
  Wrench,
  Zap,
  ShieldCheck,
  Hammer,
  Cog,
  Package,
};

export function iconFor(name: string | null | undefined): LucideIcon {
  return (name && map[name]) || Building2;
}
