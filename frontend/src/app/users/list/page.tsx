"use server"
import { User } from "@/components/classes/users/entities/user.entity";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import UsersList from "@/components/views/users/list/listUsers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UsersListPage () {
    const userCookie=(await cookies()).get("user")?.value;
    const user:User=userCookie ? JSON.parse(userCookie) : undefined;

    if (!user) redirect("/");

    if (user.role as number < 2) redirect("/")

    return (
        <div>
            <NavBar user={user} />
            <UsersList />
            <Footer />
        </div>
    );
}