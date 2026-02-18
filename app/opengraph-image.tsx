import { ImageResponse } from "next/og";

export const alt = "Kevin Bermudez | StarDev | Portfolio - Innotive web solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(216, 180, 254, 0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "20%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(233, 213, 255, 0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Star Dev
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a3a3a3",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Web Developer & Designer
          </div>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#d8b4fe",
              }}
            />
            <span style={{ fontSize: 20, color: "#737373" }}>Portfolio</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
