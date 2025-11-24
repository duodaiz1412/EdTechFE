import {Edit, Trash2} from "lucide-react";
import {Heading4} from "@/components/Typography";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import type {Item} from "../types/index.ts";
interface ItemProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export default function ItemDisplay({item, onEdit, onDelete}: ItemProps) {
  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div>
          <Heading4 className="text-gray-900">{item.title}</Heading4>
          <div className="mt-2 flex items-center gap-4">
            <Chip
              variant={item.status === "Draft" ? "warning" : "success"}
              size="sm"
            >
              {item.status}
            </Chip>
            {item.publishedAt && (
              <p className="text-xs text-gray-500">
                Published on: {item.publishedAt}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="edit"
          className="text-green-600 hover:text-green-700 hover:bg-green-50 "
          onClick={() => onEdit?.(item)}
        >
          <Edit size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="delete"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete?.(item)}
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
