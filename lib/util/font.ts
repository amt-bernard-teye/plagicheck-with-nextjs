import { Archivo } from "next/font/google";
import { Holtwood_One_SC } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const holtwood = Holtwood_One_SC({
  weight: ["400"],
  subsets: ["latin"]
});

export { archivo, holtwood };