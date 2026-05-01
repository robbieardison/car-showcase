"use client";

import Image from "next/image";
import { Car, SalesPerson } from "@/types";

interface CarDetailsProps {
    car: Car | null;
    isOpen: boolean;
    onClose: () => void;
    salesPeople: SalesPerson[];
}

const CarDetails = ({ car, isOpen, onClose, salesPeople }: CarDetailsProps) => {
    if (!isOpen || !car) {
        return null;
    }

    const formattedPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(car.price);

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="car-details__dialog-panel" key={car.id}>
                <button
                    type="button"
                    onClick={onClose}
                    className="car-details__close-btn"
                    aria-label="Close car details"
                >
                    <Image src="/close.svg" alt="close" width={20} height={20} />
                </button>

                <div className="car-details__main-image bg-slate-100 overflow-hidden h-56">
                    <Image
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        width={1200}
                        height={700}
                        unoptimized
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold">
                        {car.make} {car.model}
                    </h3>
                    <p className="text-grey">{car.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary-blue-100 rounded-lg p-3">
                        <p className="text-sm text-grey">Year</p>
                        <p className="font-semibold">{car.year}</p>
                    </div>
                    <div className="bg-primary-blue-100 rounded-lg p-3">
                        <p className="text-sm text-grey">Harga Jual</p>
                        <p className="font-semibold">{formattedPrice}</p>
                    </div>
                    <div className="bg-primary-blue-100 rounded-lg p-3">
                        <p className="text-sm text-grey">Bahan Bakar</p>
                        <p className="font-semibold">{car.fuelType}</p>
                    </div>
                    <div className="bg-primary-blue-100 rounded-lg p-3">
                        <p className="text-sm text-grey">Transmission</p>
                        <p className="font-semibold">{car.transmission}</p>
                    </div>
                    <div className="bg-primary-blue-100 rounded-lg p-3 col-span-2">
                        <p className="text-sm text-grey">Seats</p>
                        <p className="font-semibold">{car.seats}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-semibold">Pilih sales untuk chat WhatsApp</h4>
                    {salesPeople.map((person) => {
                        const message = encodeURIComponent(
                            `Halo ${person.name}, saya tertarik membeli ${car.make} ${car.model} (${car.year}) dengan harga ${formattedPrice}. Apakah unit masih tersedia?`
                        );
                        const whatsAppUrl = `https://wa.me/${person.phone}?text=${message}`;

                        return (
                            <div key={person.id} className="bg-primary-blue-100 rounded-lg p-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{person.name}</p>
                                    <p className="text-sm text-grey">{person.area}</p>
                                </div>
                                <a
                                    href={whatsAppUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm px-3 py-2 rounded-full bg-primary-blue text-white"
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
