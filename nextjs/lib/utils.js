import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {remark} from "remark";
import html from "remark-html";

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const mdConvert = async (MD) => {
    const data = await remark().use(html).process(MD);
    return data.toString();
}