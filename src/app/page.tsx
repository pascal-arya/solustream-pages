import Link from "next/link";

export default function Home() {
  return (
    <main className="home-container">
      <div className="home-card">
        <img
          src="/Assets/solustream_logo.png"
          alt="Solustream Logo"
          className="home-logo"
        />
        <h1 className="home-title">Feedback Portal</h1>
        <p className="home-desc">
          We strive to provide you with the best streaming service possible.
          Please take a moment to fill out our satisfaction form and let us
          know how we can improve.
        </p>
        <Link href="/satisfaction-forms" className="btn-start" id="btn-start-survey">
          Start Survey
          <span style={{ marginLeft: "8px", transition: "transform 0.2s ease" }}>&rarr;</span>
        </Link>
      </div>
    </main>
  );
}
