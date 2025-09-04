import Login from "../auth/components/Login";

export default function LandingPage() {
  return (
    <div>
      <h1>Stegvis</h1>
      <p>Registrera dig eller logga in för att komma igång.</p>
      <Login></Login>
    </div>
  );
}