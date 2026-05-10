import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ChefHat,
  Droplet,
  FlaskConical,
  Leaf,
  Lightbulb,
  MapPin,
  Cross,
  Package,
  DoorOpen,
  Sprout,
  Trees,
  UsersRound,
  Warehouse,
  Wind
} from "lucide-react";

/** Mapeamento opcional de ícones por id de zona (futuros UI). */
export const CAMPUS_ZONE_ICON_MAP: Record<string, LucideIcon> = {
  greenhouse: Warehouse,
  tree: Trees,
  lamp: Lightbulb,
  flask: FlaskConical,
  droplet: Droplet,
  cross: Cross,
  "book-open": BookOpen,
  sprout: Sprout,
  boxes: Package,
  leaf: Leaf,
  "chef-hat": ChefHat,
  wind: Wind,
  users: UsersRound,
  plant: Leaf,
  warehouse: Warehouse,
  "map-pin": MapPin,
  gate: DoorOpen
};
