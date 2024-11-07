export interface SidebarButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  text: string;
  type?: "action" | "content" | "user";
  active?: boolean;
}
