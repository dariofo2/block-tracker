"use server"

import { User } from "@/components/classes/users/entities/user.entity";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import GraphGroupByAccountsAndTimeStamp from "@/components/views/transactions/graphs/graphGroupByAccountsAndTimestamp"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GraphsAccountsPage() {
    const userCookie = (await cookies()).get("user")?.value;
    const user: User = userCookie ? JSON.parse(userCookie) : undefined;

    if (!user) redirect("/");
    return (
        <div>
            <NavBar user={user} />
            <GraphGroupByAccountsAndTimeStamp />
            <Footer />
        </div>
    )
}