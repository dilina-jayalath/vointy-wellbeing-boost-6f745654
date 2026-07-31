import { loadFont as loadDisplay } from "@remotion/google-fonts/Outfit";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

export const display = loadDisplay("normal", { weights: ["300", "600", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
