"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { DrinkWithCategory } from "@/types";

interface DrinkCardProps {
  drink: DrinkWithCategory;
  index?: number;
}

export function DrinkCard({ drink, index = 0 }: DrinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/menu/${drink.slug}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={drink.image}
              alt={drink.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {drink.isPopular && (
              <Badge className="absolute left-2 top-2 gap-1 bg-accent text-accent-foreground">
                <Star className="h-3 w-3 fill-current" />
                Popular
              </Badge>
            )}
          </div>
          <div className="p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {drink.category.name}
            </p>
            <h3 className="mt-0.5 font-semibold leading-tight line-clamp-2">{drink.name}</h3>
            <p className="mt-1 text-sm font-bold text-primary">{formatCurrency(drink.price)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
