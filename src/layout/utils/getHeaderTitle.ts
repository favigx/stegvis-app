export function getHeaderTitle(pathname: string): string {
  // Decoda URL (hanterar URL-encoded svenska tecken)
  const decodedPath = decodeURIComponent(pathname);

  // Dela upp path i segments (för att stödja subroutes)
  const segments = decodedPath.split("/").filter(Boolean); // tar bort tomma segment

  if (segments.length === 0) return "Stegvis"; // root

  switch (segments[0]) {
    case "dashboard":
      return "Dashboard";
    case "anteckningar":
      return "Anteckningar";
     case "studieplaneraren":
      return "Studieplaneraren"; 
    case "inställningar":
      return "Inställningar";
    case "målplaneraren":
      return "Målplaneraren";
    case "deadlines":
      return "Deadlines";
    case "min-utbildning":
      return "Min utbildning";
    case "abonnemang":
      return "Abonnemang";
    case "home":
      return "Home";
    case "kom-igang":
      return "";
    default:
      return "Stegvis";
  }
}
