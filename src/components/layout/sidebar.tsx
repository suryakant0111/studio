"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  BookOpen,
  Sparkles,
  BarChart3,
  Calendar,
  User,
  Settings,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';


const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/recipes', icon: BookOpen, label: 'My Recipes' },
  { href: '/generator', icon: Sparkles, label: 'AI Recipe Generator' },
  { href: '/tracker', icon: BarChart3, label: 'Nutrition Tracker' },
  { href: '/planner', icon: Calendar, label: 'Meal Planner' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };


  return (
    <div className="flex h-full flex-col">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <UtensilsCrossed className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-semibold">NutriChef</h1>
        </Link>
      </SidebarHeader>

      <div className="flex-1 overflow-y-auto">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>

      <SidebarFooter>
         <Separator className="my-2" />
         <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings" asChild>
                <Link href="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </div>
  );
}
