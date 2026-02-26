import { MdLightMode, MdDarkMode } from "react-icons/md";
import { GrPersonalComputer } from "react-icons/gr";
import { Theme } from "@/interfaces/theme.interface";

export const themeOptions: Theme[] = [
  {
    value: "light",
    icon: <MdLightMode className="h-5 w-5" />,
  },
  {
    value: "dark",
    icon: <MdDarkMode className="h-5 w-5" />,
  },
  {
    value: "system",
    icon: <GrPersonalComputer className="h-5 w-5" />,
  },
];
