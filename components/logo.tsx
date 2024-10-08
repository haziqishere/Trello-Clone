import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const headingFont = localFont({
    src: "../public/fonts/CalSans-SemiBold.woff2"
});

export const Logo =  () => {
    return (
        <Link href={"/"}>
            <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
                <Image
                    src="/image/logo.svg"
                    alt="Taskify Logo"
                    width={30}
                    height={30}
                />
                <p className={cn(
                        "text-lg text-neutral-700",
                        headingFont.className)}>
                    Taskify
                </p>
                
            </div>
        </Link>
    )
}