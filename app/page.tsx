"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [wishlistHydrated, setWishlistHydrated] = useState(false);
  const [comparedCarIds, setComparedCarIds] = useState<Set<string>>(new Set());
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);

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

  useEffect(() => {
    if (comparedCarIds.size === 0) {
      setIsCompareOpen(false);
    }
  }, [comparedCarIds]);

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
    const next = new Set(wishlistedCarIds);
    if (next.has(carId)) {
      next.delete(carId);
    } else {
      next.add(carId);
    }
    setWishlistedCarIds(next);
    window.localStorage.setItem("wishlistCarIds", JSON.stringify(Array.from(next)));
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

      {comparedCars.length > 0 && (
        <button
          type="button"
          onClick={() => setIsCompareOpen(true)}
          className="fixed right-6 bottom-6 z-40 bg-primary-blue text-white px-5 py-3 rounded-full shadow-lg"
        >
          Buka Compare ({comparedCars.length})
        </button>
      )}

      {isCompareOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-2xl font-bold">Compare Mobil</h3>
                <p className="text-sm text-grey">
                  Biar gampang lihat beda harga, tahun, dan spesifikasi.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setComparedCarIds(new Set())}
                  className="text-sm px-3 py-2 rounded-full border border-gray-300"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompareOpen(false)}
                  className="text-sm px-3 py-2 rounded-full bg-primary-blue text-white"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-5">
              {comparedCars.map((car) => (
                <div key={car.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="relative h-36 w-full overflow-hidden rounded-lg bg-white">
                    <Image src={car.image} alt={`${car.make} ${car.model}`} fill className="object-cover" />
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-lg">{car.make} {car.model}</p>
                    <p className="text-sm text-grey">{car.year}</p>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm"><span className="text-grey">Harga:</span> {formatRupiah(car.price)}</p>
                    <p className="text-sm"><span className="text-grey">Fuel:</span> {car.fuelType}</p>
                    <p className="text-sm"><span className="text-grey">Transmisi:</span> {car.transmission}</p>
                    <p className="text-sm"><span className="text-grey">Seats:</span> {car.seats}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCompare(car.id)}
                    className="mt-3 text-sm px-3 py-1.5 rounded-full border border-gray-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
