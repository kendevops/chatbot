import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { Heading, View } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";

const client = generateClient<Schema>();

export default function App() {
  const { useAIConversation } = createAIHooks(client);

  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat");

  async function handleSignOut() {
    await signOut();
  }

  return (
    <main>
      <button onClick={handleSignOut}>Sign out</button>
      <View flex={1} height="80vh">
        <Heading level={3}>Amplify AI For Amazon Web Services</Heading>
        <AIConversation
          messages={messages}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
        />
      </View>
    </main>
  );
}