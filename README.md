# Chatbot App with Amplify AI Kit

This template provides a minimal setup to create chatbot app using aws Amplify.

## Clone the project

```bash
git git@github.com:kendevops/chatbot.git
```

Change directory, install the dependencies and run the application.

```
cd chatbot
```

```
npm install
```

```bash
npm run dev
```

## Create an Amplify backend

Run the create amplify script in your project directory:

```bash

npm create amplify@latest

```

Then run the Amplify sandbox to start your local cloud sandbox:

```bash
npx ampx sandbox
```

This will provision the cloud resources you define in your amplify folder and watch for updates and redeploy them.

### Build your AI backend

To build an AI backend, you define AI 'routes' in your Amplify Data schema. An AI route is like an API endpoint for interacting with backend AI functionality. There are currently 2 types of routes:

- Conversation: A conversation route is a streaming, multi-turn API. Conversations and messages are automatically stored in DynamoDB so users can resume conversations. Examples of this are any chat-based AI experience or conversational UI.
- Generation: A single synchronous request-response API. A generation route is just an AppSync Query. Examples of this are: generating alt text for an image, generating structured data from unstructured input, summarization, etc.

To define AI routes, open your amplify/data/resource.ts file and use a.generation() and a.conversation() in your schema.

```bash
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model("Claude 3.5 Sonnet"),
    systemPrompt: `You are a helpful assistant`,
  })
    .authorization((allow) => allow.owner()),

  chatNamer: a
    .generation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt: `You are a helpful assistant that writes descriptive names for conversations. Names should be 2-10 words long`,
    })
    .arguments({
      content: a.string(),
    })
    .returns(
      a.customType({
        name: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

```

If you have the Amplify sandbox running, when you save this file it will pick up the changes and redeploy the necessary resources for you.

### Connect your frontend

Once the cloud sandbox is up and running, it will also create an amplify_outputs.json file, which includes relevant connection information to your AI routes and other Amplify configuration.

To connect your frontend code to your backend, you need to:

- Configure the Amplify library with the Amplify client configuration file (amplify_outputs.json).
- Generate a new API client from the Amplify library.
- Make an API request with end-to-end type-safety.
- Install the client libraries
- Install the Amplify client library to your project:

`Terminal`

```bash
npm add aws-amplify @aws-amplify/ui-react @aws-amplify/ui-react-ai
```

In your App.tsx file include this

```bash
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

```

Then go to your main.tsx file and include this

```bash
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </StrictMode>
);
```

Create an account and Login to start sending a command promot to the application.
