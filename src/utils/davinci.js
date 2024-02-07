// Import necessary modules and classes from langchain library
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';

/**
 * Facilitates conversation with an AI model using the LangChain library. hanldes chat context
 * 
 * @param {string} prompt - The prompt to start the conversation.
 * @param {string} apiKey - The API key for accessing the AI model.
 * @param {string} gptVersion - The version of the GPT model to use.
 * @returns {Promise<string>} - A Promise that resolves with the response from the AI model.
 */
export const davinci = async (prompt, apiKey, gptVersion) => {
  // Create a new instance of BufferMemory with specific configuration options
  const memory = new BufferMemory({
    returnMessages: true,  // Specify that the memory should return messages
    memoryKey: 'history',  // Assign a key for the memory storage
  });

  // Define a chat prompt template that represents a conversation between a human and an AI
  const chatPrompt = ChatPromptTemplate.fromMessages([
    // First, a system message indicating the nature of the conversation
    SystemMessagePromptTemplate.fromTemplate(
      'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context and always responds in markdown format. If the AI does not know the answer to a question, it truthfully says it does not know.'
    ),
    // Placeholder for previous messages, to maintain context
    new MessagesPlaceholder('history'),
    // Human message placeholder for the input prompt
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ]);

  // Create a new instance of ChatOpenAI with specified parameters
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,   // API key for OpenAI's GPT model
    model: gptVersion,      // Version of GPT model to use
    temperature: 0.3,       // Temperature parameter for text generation (controls randomness)
  });

  // Create a conversation chain with configured memory, prompt, and language model
  const chain = new ConversationChain({
    memory: memory,          // Use the previously defined memory
    prompt: chatPrompt,      // Use the defined chat prompt
    llm: model,              // Use the defined language model
  });

  // Call the conversation chain with the provided prompt
  const response = await chain.call({ input: prompt });

  // Log the response to the console
  console.log(response);

  // Return the generated response
  return response.response;
};
