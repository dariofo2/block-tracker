"use server"

import { User } from "@/components/classes/users/entities/user.entity";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import Login from "@/components/views/users/login/login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const userCookie = (await cookies()).get("user")?.value;
  const user: User = userCookie ? JSON.parse(userCookie) : undefined;

  if (user) redirect("/graphs/accounts");
  return (
    <div>
      <main>
        <NavBar />
        <h1>Log In</h1>
        <Login />
        <Footer />
      </main>
    </div>
  );
}
