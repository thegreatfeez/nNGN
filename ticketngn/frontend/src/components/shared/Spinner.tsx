import { type FC } from "react";

export const Spinner: FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => (
  <div className={`spinner ${size === "sm" ? "spinner-sm" : size === "lg" ? "spinner-lg" : ""}`} />
);
