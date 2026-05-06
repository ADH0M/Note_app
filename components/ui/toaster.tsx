"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={"light" as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          error: "toast-error",
          success: "toast-success",
          warning: "toast-warning",
          info: "toast-info",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };