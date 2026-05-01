"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CarDetails, CarListing } from "@/components";
import { mockCars } from "@/data/mockCars";
import { salesPeople } from "@/data/salesPeople";
import { Car } from "@/types";

export default function WishlistPage() {
  const [wishlistedCarIds, setWishlistedCarIds] = useState<Set<string>>(new Set());
  const [wishlistHydrated, setWishlistHydrated] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    const storedWishlist = window.localStorage.getItem("wishlistCarIds");
    if (storedWishlist) {
      try {
        const parsedIds = JSON.parse(storedWishlist) as string[];
        setWishlistedCarIds(new Set(parsedIds));
      } catch {
        setWishlistedCarIds(new Set());
      }
    }
    setWishlistHydrated(true);
  }, []);

  useEffect(() => {
    if (!wishlistHydrated) return;
    window.localStorage.setItem(
      "wishlistCarIds",
      JSON.stringify(Array.from(wishlistedCarIds))
    );
  }, [wishlistedCarIds, wishlistHydrated]);

  const wishlistCars = useMemo(
    () => mockCars.filter((car) => wishlistedCarIds.has(car.id)),
    [wishlistedCarIds]
  );

  const toggleWishlist = (carId: string) => {
    const next = new Set(wishlistedCarIds);
    if (next.has(carId)) {
      next.delete(carId);
    } else {
      next.add(carId);
    }
    setWishlistedCarIds(next);
    window.localStorage.setItem("wishlistCarIds", JSON.stringify(Array.from(next)));
  };

  return (
    <main className="overflow-hidden padding-x padding-y max-width mt-24">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Wishlist Mobil</h1>
          <p className="text-grey text-sm mt-1">
            Semua mobil favorit Anda untuk dipantau dan dihubungi sales-nya.
          </p>
        </div>
        <Link href="/" className="text-primary-blue font-semibold text-sm">
          Kembali ke katalog
        </Link>
      </div>

      <div className="mt-6">
        <CarListing
          cars={wishlistCars}
          onViewDetails={setSelectedCar}
          wishlistedCarIds={wishlistedCarIds}
          onToggleWishlist={toggleWishlist}
          comparedCarIds={new Set()}
          onToggleCompare={() => {}}
          showCompareControls={false}
        />
      </div>

      <CarDetails
        car={selectedCar}
        isOpen={selectedCar !== null}
        onClose={() => setSelectedCar(null)}
        salesPeople={salesPeople}
      />
    </main>
  );
}
