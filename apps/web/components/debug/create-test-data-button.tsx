'use client'
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useAuth } from "@clerk/nextjs";

export const CreateTestDataButton = () => {
  const { orgId } = useAuth();
  const createTestData = useMutation(api.private.testData.createTestData);

  const handleCreateTestData = async () => {
    if (!orgId) {
      alert("No organization ID found. Please make sure you're logged in and have selected an organization.");
      return;
    }

    try {
      const result = await createTestData({ organizationId: orgId });
      alert(`Success! ${result.message}`);
      console.log("Test data created:", result);
    } catch (error) {
      console.error("Error creating test data:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to create test data"}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Debug Tools</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create some test conversations to debug the conversations panel.
      </p>
      <Button onClick={handleCreateTestData} variant="outline">
        Create Test Conversations
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        Organization ID: {orgId || "Not found"}
      </p>
    </div>
  );
};
