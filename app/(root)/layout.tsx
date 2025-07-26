import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";
import MobileNavigation from "@/components/MobileNavigation";
import { getCurrentUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  if (!currentUser) redirect("/sign-in");

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />{" "}
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;
