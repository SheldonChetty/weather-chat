import "./intro.css";

export default function Intro() {
  return (
    <div className="intro-screen">
      <h1 className="intro-title">Weather Agent</h1>

      <div className="petals">
        {Array.from({ length: 20 }).map((_, i) => (
            <span
                key={i}
                className="petal"
                style={{
                left: Math.random() * 100 + "vw",
                animationDuration: 3 + Math.random() * 5 + "s",
                animationDelay: Math.random() * 3 + "s"
                }}
            ></span>
        ))}

      </div>
    </div>
  );
}
