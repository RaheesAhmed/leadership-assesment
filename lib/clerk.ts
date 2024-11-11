export const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export const clerkConfig = {
  publishableKey: clerkPublishableKey,
  appearance: {},
};
