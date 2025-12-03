import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        padding: "24px",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        MANGO Range Component
      </h1>

      <p style={{ color: "var(--color-muted)", textAlign: "center" }}>
        Custom Range component with two usage modes
      </p>

      <nav
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link
          href="/exercise1"
          style={{
            padding: "12px 24px",
            background: "var(--color-foreground)",
            color: "var(--color-background)",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: 500,
            transition: "opacity 150ms ease",
          }}
        >
          Exercise 1: Normal Range
        </Link>

        <Link
          href="/exercise2"
          style={{
            padding: "12px 24px",
            background: "var(--color-foreground)",
            color: "var(--color-background)",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: 500,
            transition: "opacity 150ms ease",
          }}
        >
          Exercise 2: Fixed Range
        </Link>
      </nav>
    </main>
  );
}
