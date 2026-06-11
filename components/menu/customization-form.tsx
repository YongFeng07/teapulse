"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { SUGAR_LEVELS, ICE_LEVELS, TOPPINGS, TOPPING_PRICE } from "@/types";
import type { SugarLevel, IceLevel, Topping } from "@/types";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface CustomizationFormProps {
  sugarLevel: SugarLevel;
  iceLevel: IceLevel;
  toppings: Topping[];
  quantity: number;
  basePrice: number;
  onSugarChange: (level: SugarLevel) => void;
  onIceChange: (level: IceLevel) => void;
  onToppingToggle: (topping: Topping) => void;
  onQuantityChange: (qty: number) => void;
}

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              value === opt
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CustomizationForm({
  sugarLevel,
  iceLevel,
  toppings,
  quantity,
  basePrice,
  onSugarChange,
  onIceChange,
  onToppingToggle,
  onQuantityChange,
}: CustomizationFormProps) {
  const toppingsCost = toppings.length * TOPPING_PRICE;
  const unitPrice = basePrice + toppingsCost;
  const total = unitPrice * quantity;

  return (
    <div className="space-y-5">
      <OptionGroup label="Sugar Level" options={SUGAR_LEVELS} value={sugarLevel} onChange={onSugarChange} />
      <OptionGroup label="Ice Level" options={ICE_LEVELS} value={iceLevel} onChange={onIceChange} />

      <div>
        <p className="mb-2 text-sm font-medium">
          Toppings <span className="text-muted-foreground">(+{formatCurrency(TOPPING_PRICE)} each)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {TOPPINGS.map((topping) => {
            const selected = toppings.includes(topping);
            return (
              <button
                key={topping}
                type="button"
                onClick={() => onToppingToggle(topping)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {topping}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Quantity</p>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
          <Button variant="outline" size="icon" onClick={() => onQuantityChange(quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
          <span className="ml-auto text-lg font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
