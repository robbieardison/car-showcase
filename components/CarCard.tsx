"use client";

import Image from "next/image";
import { Car } from "@/types";
import CustomButton from "./CustomButton";

interface CarCardProps {
    car: Car;
    onViewDetails: (car: Car) => void;
    isWishlisted: boolean;
    onToggleWishlist: (carId: string) => void;
    isCompared: boolean;
    onToggleCompare: (carId: string) => void;
    disableCompare: boolean;
    showCompareControl?: boolean;
}

const CarCard = ({
    car,
    onViewDetails,
    isWishlisted,
    onToggleWishlist,
    isCompared,
    onToggleCompare,
    disableCompare,
    showCompareControl = true
}: CarCardProps) => {
    const formattedPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(car.price);

    return (
        <div
            className="car-card group cursor-pointer"
            onClick={() => onViewDetails(car)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onViewDetails(car);
                }
            }}
        >
            <div className="car-card__content">
                <div>
                    <h2 className="car-card__content-title">
                        {car.make} {car.model}
                    </h2>
                    <p className="text-sm text-grey mt-1">{car.year}</p>
                </div>
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggleWishlist(car.id);
                    }}
                    className="rounded-full p-2 bg-white"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Image
                        src={isWishlisted ? "/heart-filled.svg" : "/heart-outline.svg"}
                        width={20}
                        height={20}
                        alt="wishlist"
                    />
                </button>
            </div>

            <p className="car-card__price">
                <span className="car-card__price-day text-base">{formattedPrice}</span>
            </p>

            <div className="relative w-full h-40 my-3">
                <Image
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-contain"
                />
            </div>

            <div className="relative w-full mt-2">
                {showCompareControl && (
                    <div className="flex gap-2 mb-3">
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onToggleCompare(car.id);
                            }}
                            disabled={disableCompare}
                            className={`text-xs px-3 py-1.5 rounded-full border ${
                                isCompared
                                    ? "bg-primary-blue text-white border-primary-blue"
                                    : "bg-white text-black-100 border-gray-200"
                            } ${disableCompare ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isCompared ? "In Compare" : "Compare"}
                        </button>
                    </div>
                )}
                <div className="car-card__icon-container">
                    <div className="car-card__icon">
                        <Image src="/steering-wheel.svg" width={20} height={20} alt="transmission" />
                        <p className="car-card__icon-text">{car.transmission}</p>
                    </div>
                    <div className="car-card__icon">
                        <Image src="/tire.svg" width={20} height={20} alt="fuel type" />
                        <p className="car-card__icon-text">{car.fuelType}</p>
                    </div>
                    <div className="car-card__icon">
                        <Image src="/car-logo.svg" width={20} height={20} alt="seats" />
                        <p className="car-card__icon-text">{car.seats} seats</p>
                    </div>
                </div>

                <div className="car-card__btn-container">
                    <CustomButton
                        title="View Details"
                        btnType="button"
                        containerStyles="w-full py-[16px] rounded-full bg-primary-blue text-white"
                        handleClick={() => onViewDetails(car)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CarCard;
