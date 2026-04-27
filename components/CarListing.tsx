import { Car } from "@/types";
import CarCard from "./CarCard";

interface CarListingProps {
    cars: Car[];
    onViewDetails: (car: Car) => void;
    wishlistedCarIds: Set<string>;
    onToggleWishlist: (carId: string) => void;
    comparedCarIds: Set<string>;
    onToggleCompare: (carId: string) => void;
    showCompareControls?: boolean;
}

const CarListing = ({
    cars,
    onViewDetails,
    wishlistedCarIds,
    onToggleWishlist,
    comparedCarIds,
    onToggleCompare,
    showCompareControls = true
}: CarListingProps) => {
    if (!cars.length) {
        return (
            <div className="home__error-container">
                <h2 className="text-black text-xl font-bold">No cars found</h2>
                <p className="text-sm text-grey">
                    Coba ubah filter tahun, harga, atau kata kunci pencarian.
                </p>
            </div>
        );
    }

    return (
        <div className="home__cars-wrapper">
            {cars.map((car) => (
                <CarCard
                    key={car.id}
                    car={car}
                    onViewDetails={onViewDetails}
                    isWishlisted={wishlistedCarIds.has(car.id)}
                    onToggleWishlist={onToggleWishlist}
                    isCompared={comparedCarIds.has(car.id)}
                    onToggleCompare={onToggleCompare}
                    disableCompare={!comparedCarIds.has(car.id) && comparedCarIds.size >= 3}
                    showCompareControl={showCompareControls}
                />
            ))}
        </div>
    );
};

export default CarListing;
