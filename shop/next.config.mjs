/** @type {import('next').NextConfig} */
const remotePatterns = [];

const apiImageUrl = process.env.NEXT_PUBLIC_API_IMAGE_URL;
if (apiImageUrl) {
  try {
    const { protocol, hostname, port } = new URL(apiImageUrl);
    remotePatterns.push({
      protocol: protocol.replace(":", ""),
      hostname,
      ...(port ? { port } : {}),
      pathname: "/**",
    });
  } catch {}
}

// In development with Docker, Next.js image optimization cannot reach
// internal Docker hostnames (private IP restriction). Disable it in dev
// so the browser loads images directly via the public-facing URL.
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  images: {
    remotePatterns,
    unoptimized: isDev,
  },
};

export default nextConfig;
