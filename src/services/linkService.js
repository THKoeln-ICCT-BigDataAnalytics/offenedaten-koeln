export const ORIGINAL_BASE_URL = "https://offenedaten-koeln.de";

export function originalUrl(path = "/") {
  return `${ORIGINAL_BASE_URL}${path}`;
}

export const originalLinks = {
  home: originalUrl("/"),
  logo: originalUrl("/themes/custom/dkan_bootstrap5/dist/bootstrap/img/logo.svg"),
  cityLogo: originalUrl("/themes/custom/dkan_bootstrap5/dist/bootstrap/img/parent-logo.svg"),
  hero: originalUrl("/themes/custom/dkan_bootstrap5/dist/bootstrap/img/hero.jpg"),
};

// Props für alle Links, die auf eine externe Seite führen.
export const externalLinkProps = { target: "_blank", rel: "noopener noreferrer" };
