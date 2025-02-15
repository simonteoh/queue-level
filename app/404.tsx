import { Suspense } from "react";
import NotFoundClient from "./NotFoundClient";

// ✅ Prevent static pre-rendering error
export const dynamic = "force-dynamic";

export default function NotFoundPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <NotFoundClient />
        </Suspense>
    );
}
