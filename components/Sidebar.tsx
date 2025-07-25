"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/app/constants";
import { cn } from "@/lib/utils";

const Sidebar = ({
  fullName,
  email,
  avatar,
}: {
  fullName: string;
  email: string;
  avatar: string;
}) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src={"/assets/icons/logo-full-brand.svg"}
          alt="home"
          width={160}
          height={24}
          className="hidden h-auto lg:block"
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          width={52}
          height={52}
          className="lg:hidden"
          alt={"logo"}
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => {
            return (
              <Link key={name} href={url} className="lg:w-full">
                <li
                  className={cn(
                    "sidebar-nav-item",
                    pathname === url && "shad-active"
                  )}
                >
                  <Image
                    src={icon}
                    alt="name"
                    width={24}
                    height={24}
                    className={cn(
                      "nav-icon",
                      pathname === url && "nav-icon-active"
                    )}
                  />
                  <p>{name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <Image
        src={"/assets/images/files-2.png"}
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <div className="subtitle-2 capitalize">{fullName}</div>
          <div className="caption">{email}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
