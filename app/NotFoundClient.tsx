"use client"; // ✅ Ensure this is a Client Component

import React from "react";
import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
    const searchParams = useSearchParams(); // ✅ This now works safely

    return <div>Page Not Found - {searchParams.get("q")}</div>;
}
