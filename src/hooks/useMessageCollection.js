import { useState, useEffect } from 'react';

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array, the `addMessage` function, the `clearMessages` function, and the `loadMessage` function.
 */
const useMessageCollection = () => {
  // State to store the messages array
  const [messages, setMessages] = useState([]);

  // Effect to load messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages'));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, []);

  // Effect to store messages to localStorage whenever the messages array changes
  useEffect(() => {
    if (messages.length) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);

  /**
   * A function for adding a new message to the collection.
   *
   * @param {Object} message - The message to add to the collection.
   */
  const addMessage = (message) => {
    // Update the messages state by appending the new message
    setMessages((prev) => [...prev, message]);
  };

  /**
   * A function for clearing all messages in the collection and resetting to the initial message.
   */
  const clearChat = () => {
    // Clear messages from localStorage and reset messages state to an empty array
    localStorage.setItem('messages', JSON.stringify([]));
    setMessages([]);
  };

  // Return messages state and functions for adding messages and clearing messages
  return { messages, addMessage, clearChat };
};

export default useMessageCollection;
