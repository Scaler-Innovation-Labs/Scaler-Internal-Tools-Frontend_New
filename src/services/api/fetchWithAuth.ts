// This utility has been moved to the useAuth hook for better integration
// Use the fetchWithAuth method from the useAuth hook instead
// Example: const { fetchWithAuth } = useAuth();

// This file is kept for backwards compatibility
// The new implementation is in hooks/use-auth.tsx

export function fetchWithAuth() {
  throw new Error(
    'fetchWithAuth has been moved to the useAuth hook. ' +
    'Please use: const { fetchWithAuth } = useAuth(); instead.'
  );
}
