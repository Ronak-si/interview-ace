import { useAuthContext } from "@/context/AuthContext";

/** Thin hook wrapper so components import a hook, not the context object. */
export function useAuth() {
  return useAuthContext();
}
