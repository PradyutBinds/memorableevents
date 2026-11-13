import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl prose prose-lg dark:prose-invert">
          <h1 className="font-serif">Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>At Memorable Events, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
          <h2>Information We Collect</h2>
          <p>We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.</p>
          <h2>How We Use Your Information</h2>
          <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        </div>
      </div>
    </PublicLayout>
  );
}