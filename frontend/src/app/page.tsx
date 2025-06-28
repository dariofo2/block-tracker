"use server"

import Login from "@/components/views/users/login/login";

export default async function Home() {
  return (
    <div>
      <main>
        <h1>Log In</h1>
        <Login />
      </main>
    </div>
  );
}
