"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { CarDetails, CarListing, Hero, SearchBar, YearFilter } from "@/components";
import { mockCars } from "@/data/mockCars";
import { salesPeople } from "@/data/salesPeople";
import { Car } from "@/types";

export default function Home() {
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [wishlistedCarIds, setWishlistedCarIds] = useState<Set<string>>(new Set());
  const [comparedCarIds, setComparedCarIds] = useState<Set<string>>(new Set());

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);

  useEffect(() => {
    const storedWishlist = window.localStorage.getItem("wishlistCarIds");
    if (!storedWishlist) return;
    try {
      const parsedIds = JSON.parse(storedWishlist) as string[];
      setWishlistedCarIds(new Set(parsedIds));
    } catch {
      setWishlistedCarIds(new Set());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "wishlistCarIds",
      JSON.stringify(Array.from(wishlistedCarIds))
    );
  }, [wishlistedCarIds]);

  const availableYears = useMemo(
    () => Array.from(new Set(mockCars.map((car) => car.year))).sort((a, b) => b - a),
    []
  );

  const filteredCars = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    const baseCars = mockCars.filter((car) => {
      const matchesYear = selectedYear === "all" || car.year === Number(selectedYear);
      const matchesQuery =
        keyword.length === 0 || `${car.make} ${car.model}`.toLowerCase().includes(keyword);
      const matchesPrice = car.price <= maxPrice;

      return matchesYear && matchesQuery && matchesPrice;
    });

    const sortedCars = [...baseCars];
    switch (sortBy) {
      case "price-asc":
        sortedCars.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedCars.sort((a, b) => b.price - a.price);
        break;
      case "year-desc":
        sortedCars.sort((a, b) => b.year - a.year);
        break;
      case "year-asc":
        sortedCars.sort((a, b) => a.year - b.year);
        break;
      default:
        break;
    }

    return sortedCars;
  }, [selectedYear, searchQuery, maxPrice, sortBy]);

  const comparedCars = useMemo(
    () => mockCars.filter((car) => comparedCarIds.has(car.id)),
    [comparedCarIds]
  );

  const toggleWishlist = (carId: string) => {
    setWishlistedCarIds((prev) => {
      const next = new Set(prev);
      if (next.has(carId)) {
        next.delete(carId);
      } else {
        next.add(carId);
      }
      return next;
    });
  };

  const toggleCompare = (carId: string) => {
    setComparedCarIds((prev) => {
      const next = new Set(prev);
      if (next.has(carId)) {
        next.delete(carId);
      } else if (next.size < 3) {
        next.add(carId);
      }
      return next;
    });
  };

  return (
    <main className="overflow-hidden">
      <Hero />

      <section id="discover" className="mt-12 padding-x padding-y max-width">
        <div className="home__text-container">
          <h2 className="text-4xl font-extrabold">Car Catalogue</h2>
          <p>Temukan mobil terbaik untuk dibeli sesuai kebutuhan dan budget Anda.</p>
        </div>

        <div className="home__filters">
          <SearchBar query={searchQuery} onChange={setSearchQuery} />
          <div className="home__filter-container">
            <YearFilter
              years={availableYears}
              selectedYear={selectedYear}
              onChange={setSelectedYear}
            />
            <div className="w-full max-w-[220px]">
              <label htmlFor="sortBy" className="sr-only">
                Sort cars
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="custom-filter__btn"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Harga: Murah ke Mahal</option>
                <option value="price-desc">Harga: Mahal ke Murah</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="year-asc">Year: Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-primary-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="font-medium">Harga maksimal: {formatRupiah(maxPrice)}</p>
            <Link href="/wishlist" className="text-sm text-primary-blue font-semibold">
              Wishlist: {wishlistedCarIds.size} mobil
            </Link>
          </div>
          <input
            type="range"
            min={250000000}
            max={1000000000}
            step={5000000}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="w-full mt-3"
          />
        </div>

        {comparedCars.length > 0 && (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-lg font-semibold">Compare Mode ({comparedCars.length}/3)</h3>
              <button
                type="button"
                onClick={() => setComparedCarIds(new Set())}
                className="text-sm px-3 py-1 rounded-full border border-gray-300"
              >
                Clear Compare
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-3 mt-3">
              {comparedCars.map((car) => (
                <div key={car.id} className="bg-primary-blue-100 rounded-lg p-3">
                  <p className="font-semibold">{car.make} {car.model}</p>
                  <p className="text-sm text-grey">{car.year} - {formatRupiah(car.price)}</p>
                  <p className="text-sm text-grey">{car.fuelType} - {car.transmission}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <CarListing
          cars={filteredCars}
          onViewDetails={setSelectedCar}
          wishlistedCarIds={wishlistedCarIds}
          onToggleWishlist={toggleWishlist}
          comparedCarIds={comparedCarIds}
          onToggleCompare={toggleCompare}
        />
      </section>

      <CarDetails
        car={selectedCar}
        isOpen={selectedCar !== null}
        onClose={() => setSelectedCar(null)}
        salesPeople={salesPeople}
      />
    </main>
  );
}
