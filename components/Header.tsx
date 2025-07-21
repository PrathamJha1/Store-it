"use client";
import { Button } from "./ui/button";
import Image from "next/image";
import React from "react";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/users.actions";
import { useRouter } from "next/navigation";
const Header = () => {
  const router = useRouter();

  const handleSignout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOutUser();
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />
        <form>
          <Button
            type="submit"
            className="sign-out-button"
            onClick={handleSignout}
          >
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
