import Image from "next/image";

export const Logo = (props) => (
    <>
    <Image priority className="h-4 w-auto dark:invert dark:hue-rotate-180" src='/next.svg' alt='Logo' width={300} height={160} {...props} />
    </>
);