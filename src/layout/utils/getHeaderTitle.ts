 export function getHeaderTitle(pathname: string) {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/notes":
      return "Anteckningar";
    case "/settings-preferences":
      return "Inställningar & Preferenser";
    default:
      return "Stegvis"; 
  }
}
