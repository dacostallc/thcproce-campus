import { permanentRedirect } from "next/navigation";

/** O campus canónico fica na raiz (/); mantemos /campus como alias permanente. */
export default function CampusLegacyPathRedirect() {
  permanentRedirect("/");
}
