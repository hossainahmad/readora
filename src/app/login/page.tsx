import LoginOptions from "@/components/LoginOptions";

export const dynamic = "force-dynamic";

const providers = [
  {
    id: "google",
    label: "Continue with Google",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  {
    id: "facebook",
    label: "Continue with Facebook",
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  },
  {
    id: "github",
    label: "Continue with GitHub",
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
];

export default function LoginPage() {
  const enabledProviders = providers
    .filter(
      (provider) => provider.clientId?.trim() && provider.clientSecret?.trim(),
    )
    .map(({ id, label }) => ({ id, label }));

  return <LoginOptions providers={enabledProviders} />;
}
