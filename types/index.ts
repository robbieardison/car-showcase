import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    title: string;
    containerStyles?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    btnType: "button" | "submit";
}

export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
    transmission: "Automatic" | "Manual";
    seats: number;
    image: string;
    description: string;
}

export interface SalesPerson {
    id: string;
    name: string;
    phone: string;
    area: string;
}