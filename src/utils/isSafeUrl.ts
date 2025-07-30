import isIP from "validator/es/lib/isIP";

export const isSafeUrl = (str: string): boolean => {
  // 1) Must start with "https://" exactly
  if (!str.startsWith("https://")) return false;

  // 2) Extract the raw host (before any slash or port)
  let rawHost = str.slice(8).split("/")[0];
  // Handle IPv6 brackets
  if (rawHost.startsWith("[")) {
    rawHost = rawHost.split("]")[0] + "]";
  } else {
    rawHost = rawHost.split(":")[0];
  }

  // 3) Reject mixed‐case or trailing dots in the *original* host
  if (/[A-Z]/.test(rawHost) || rawHost.endsWith(".")) {
    return false;
  }

  // 4) Parse, then standard checks
  let url: URL;
  try {
    url = new URL(str);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;
  if (url.username || url.password) return false;
  if (url.port && url.port !== "443") return false;
  if (str.length > 2048) return false;

  const host = url.hostname; // now lowercased, no brackets

  // 5) Block localhost or IPv4 0.0.0.0
  if (host === "localhost" || host === "0.0.0.0") return false;

  // 6) Block any private IP (IPv4 & IPv6)
  const cleanHost = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
  if (isPrivateIp(cleanHost)) return false;

  return true;
};

function isPrivateIp(ipStr: string): boolean {
  // IPv6 private ranges
  if (isIP(ipStr, 6)) {
    return (
      ipStr === "::1" ||
      /^f[cd]/i.test(ipStr) ||
      /^fe80:/i.test(ipStr)
    );
  }

  // IPv4 private ranges
  if (isIP(ipStr, 4)) {
    const [o1, o2] = ipStr.split(".").map(Number);
    return (
      o1 === 10 ||
      (o1 === 172 && o2 >= 16 && o2 <= 31) ||
      (o1 === 192 && o2 === 168) ||
      o1 === 127 ||
      (o1 === 169 && o2 === 254)
    );
  }

  return false;
}
