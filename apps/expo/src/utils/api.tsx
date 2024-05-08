import { useState } from "react";
import Constants from "expo-constants";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@acme/api";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@acme/api";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
const getBaseUrl = () => {
  /**
   * Returns the API URL based on the environment.
   * In development, it uses the localhost address.
   * In production, it uses the API_URL from the environment variables.
   */

  if (process.env.NODE_ENV === "development") {
    return process.env.EXPO_PUBLIC_API_URL;
  } else {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(":")[0];

    if (!localhost) {
      throw new Error(
        "Failed to get localhost. Please point to your production server.",
      );
    }
    return `http://${localhost}:3000`;
  }
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export const TRPCProvider = (props: { children: React.ReactNode }) => {
  const supabase = useSupabaseClient();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "expo-react");

            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            if (token) headers.set("authorization", token);

            return Object.fromEntries(headers);
          },
        }),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
};
