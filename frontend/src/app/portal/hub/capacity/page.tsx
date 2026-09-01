export default function Page() {
  return (
    <main style={{
      padding: "40px",
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#0f172a"
    }}>
      <div style={{
        color: "#0284c7",
        fontWeight: 900,
        fontSize: "12px",
        letterSpacing: "2px"
      }}>
        GOGATE PRODUCTS
      </div>

      <h1 style={{
        marginTop: "10px",
        fontSize: "34px",
        fontWeight: 900
      }}>
        Hub Capacity
      </h1>

      <p style={{
        marginTop: "10px",
        color: "#64748b"
      }}>
        Gogate Products Hub Operations
      </p>

      <div style={{
        marginTop: "30px",
        padding: "24px",
        borderRadius: "24px",
        background: "white",
        border: "1px solid #e2e8f0"
      }}>
        Route is working: /portal/hub/capacity
      </div>
    </main>
  );
}