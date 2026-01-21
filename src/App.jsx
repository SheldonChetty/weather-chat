import { useEffect, useState } from "react";
import Chat from "./components/Chat";
import Intro from "./components/Intro";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 5000); // 3 seconds intro

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minWidth: "320px" }}>
      {showIntro ? <Intro /> : <Chat />}
    </div>
  );
}
