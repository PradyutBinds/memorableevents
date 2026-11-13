import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Terms() {
  return (
    <PublicLayout>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl prose prose-lg dark:prose-invert">
          <h1 className="font-serif">Terms & Conditions</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Welcome to Memorable Events. These terms and conditions outline the rules and regulations for the use of Memorable Events's Website and Services.</p>
          <h2>1. Terms</h2>
          <p>By accessing this Website, accessible from https://universalagencies.in, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on Memorable Events's Website for personal, non-commercial transitory viewing only.</p>
        </div>
      </div>
    </PublicLayout>
  );
}