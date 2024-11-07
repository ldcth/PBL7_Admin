import { ReactNode } from "react";

export interface AdminLayoutProps {
  children?: ReactNode;
  select?: "1" | "2" | "3" | "4" | "5" | "6";
}
