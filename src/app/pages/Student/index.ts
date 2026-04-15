import { Page0 } from "./page0";
import { Page1 } from "./page1";
import { Page2 } from "./page2";
import { Page3 } from "./page3";
import { Page4 } from "./page4";
import { Page5 } from "./page5";
import { Page6 } from "./page6";
import { Page7 } from "./page7";
import { Page8 } from "./page8";
import { Page9 } from "./page9";
import { Page10 } from "./page10";
import { Page11 } from "./page11";
import { Page12 } from "./page12";
import { PageProps } from "../util/page";
import { JSX } from "react";

export const pageList: [(({ createLink }: PageProps) => JSX.Element), string][] = [[Page0, "Home"], [Page1, "Nonograms"], [Page2, "Solving Nonograms"], [Page3, "Test Nonogram"], [Page4, "Algorithms"], [Page5, "Algorithms Quiz"], [Page6, "Space-State Search Algorithms"], [Page7, "Space-State Search Quiz"], [Page8, "Genetic Algorithms"], [Page9, "Genetic Quiz"], [Page10, "Search Algorithms"], [Page11, "Search Quiz"], [Page12, "Finish"]];
