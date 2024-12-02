import { StaticImageData } from "next/image";
import female_dark_1 from "@/src/public/images/menu-items/female-dark-1.png";
import female_dark_2 from "@/src/public/images/menu-items/female-dark-2.png";
import female_light_1 from "@/src/public/images/menu-items/female-light-1.png";
import female_light_2 from "@/src/public/images/menu-items/female-light-2.png";
import male_dark_1 from "@/src/public/images/menu-items/male-dark-1.png";
import male_dark_2 from "@/src/public/images/menu-items/male-dark-2.png";
import male_light_1 from "@/src/public/images/menu-items/male-light-1.png";
import male_light_2 from "@/src/public/images/menu-items/male-light-2.png";

type ImageFactoryResponse = {
    [key: string]: StaticImageData;
}

type ThemeOptions = "light" | "dark"

export function generateImages(theme: ThemeOptions): ImageFactoryResponse {
    let response = {
        light: {
            "female-light-1": female_light_1, "female-light-2": female_light_2, "male-light-1": male_light_1, "male-light-2": male_light_2,
        },
        dark: {
            "female-dark-1": female_dark_1, "female-dark-2": female_dark_2, "male-dark-1": male_dark_1, "male-dark-2": male_dark_2,
        }
    }
    return response[theme]
}

export function buildDate(date: Date): string {
    const daysOfWeek = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${day} ${month} ${year}`;
}