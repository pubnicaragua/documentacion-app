import {
  fineface,
  neutralface,
  sadface,
  veryfineface,
  verysadface,
} from "@/indexsvfg";
export function obtener_icon(icono:string){
     const icon =
      icono === "verysadface"
        ? verysadface
        : icono === "fineface"
        ? fineface
        : icono === "neutralface"
        ? neutralface
        : icono === "sadface"
        ? sadface
        : icono === "verysadface"
        ? verysadface
        : veryfineface;
        return icon
}