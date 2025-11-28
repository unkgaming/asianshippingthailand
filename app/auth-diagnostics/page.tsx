import React, { useEffect, useState } from "react";

const checks = [
  {
    name: "Environment Variables",
    endpoint: "/api/auth/debug",
    validate: (data) => {
      return data.env_loaded.GOOGLE_CLIENT_ID !== "NOT SET" &&
        data.env_loaded.GOOGLE_CLIENT_SECRET === "SET (hidden)" &&
        data.env_loaded.NEXTAUTH_URL.startsWith("https://") &&
        data.env_loaded.NEXTAUTH_SECRET === "SET (hidden)";
    },
  },
  {
    name: "Providers Endpoint",
    endpoint: "/api/auth/providers",
    validate: (data) => {
      return data && Object.keys(data).length > 0;
    },
  },
  {
    name: "Database Connectivity",
    endpoint: "/api/auth/test",
    validate: (data) => {
      const test = data.tests.find((t) => t.name === "Prisma Connectivity");
      return test && test.status === "success";
    },
  },
  {
    name: "Google Provider Config",
    endpoint: "/api/auth/test",
    validate: (data) => {
      const test = data.tests.find((t) => t.name === "Google Provider Config");
      return test && test.status === "success";
    },
  },
  {
    name: "Credentials Provider",
    endpoint: "/api/auth/test",
    validate: (data) => {
      const test = data.tests.find((t) => t.name === "Credentials Provider");
      return test && test.status === "success";
    },
  },
];

export default function AuthDiagnostics() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runChecks() {
      const out = [];
      for (const check of checks) {
        try {
          const res = await fetch(check.endpoint);
          const data = await res.json();
          out.push({
            name: check.name,
            status: check.validate(data) ? "success" : "error",
            details: data,
          });
        } catch (e) {
          out.push({ name: check.name, status: "error", details: String(e) });
        }
      }
      setResults(out);
      setLoading(false);
    }
    runChecks();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Auth Diagnostics</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((r) => (
            <li key={r.name} style={{ marginBottom: 18 }}>
              <strong>{r.name}:</strong>{" "}
              <span style={{ color: r.status === "success" ? "green" : "red" }}>
                {r.status === "success" ? "Working" : "Error"}
              </span>
              <details style={{ marginTop: 6 }}>
                <summary>Details</summary>
                <pre style={{ background: "#f5f5f5", padding: 10, borderRadius: 6, fontSize: 13 }}>
                  {JSON.stringify(r.details, null, 2)}
                </pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
