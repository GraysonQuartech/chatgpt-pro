import { useEffect, useState } from 'react';
import { checkApiKey } from '../../utils/checkKeys';
import PropTypes from 'prop-types';

// Component definition for Settings
const Setting = ({ modalOpen, setModalOpen }) => {
  // State variables
  const apiKey = window.localStorage.getItem('api-key') || '';
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [input, setInput] = useState('');

  // Function to handle saving API key
  const saveKey = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const keys = input;

    // Check API key validity
    await checkApiKey(keys)
      .then(() => {
        window.localStorage.setItem('api-key', keys);
        console.log('works');
        setModalOpen(false);
      })
      .catch(() => {
        console.log('doesnt work');
        setErrorMsg('error: incorrect keys');
      });

    setLoading(false);
  };

  // Function to remove API key from localStorage
  const removeApiKey = () => {
    window.localStorage.removeItem('api-key');
    setInput('');
  };

  // Effect hook to update input value when modal opens
  useEffect(() => {
    if (modalOpen) {
      setInput(apiKey);
    }
  }, [apiKey, modalOpen]);

  // JSX for the component
  return (
    <form
      onSubmit={saveKey}
      className='flex flex-col items-center justify-center gap-2'>
      {/* Instructions */}
      <p className='text-lg font-semibold'>Use your own API-key.</p>
      <p>keys are saved in your own browser</p>
      <p className='italic'>
        Get OpenAI API key{' '}
        <a
          className='text-blue-600'
          rel='noreferrer'
          target='_blank'
          href='https://platform.openai.com/account/api-keys'>
          here
        </a>
        .
      </p>
      {/* Input field for API key */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type='password'
        className='w-full max-w-xs input input-bordered'
      />
      {/* Button to save API key */}
      <button disabled={loading} className='w-full max-w-xs btn btn-outline'>
        {loading ? (
          <>
            <span className='loading loading-spinner' />
            <p>Checking Api Key</p>
          </>
        ) : (
          'save to localStorage'
        )}
      </button>
      {/* Button to remove API key */}
      {apiKey && input && (
        <span
          onClick={removeApiKey}
          disabled={loading}
          className='w-full max-w-xs btn btn-error'>
          remove keys
        </span>
      )}
      {/* Error message */}
      <p>{errorMsg}</p>
    </form>
  );
};

// PropTypes for type checking
Setting.propTypes = {
  modalOpen: PropTypes.bool.isRequired, // modalOpen prop is required and must be a boolean
  setModalOpen: PropTypes.func.isRequired, // setModalOpen prop is required and must be a function
};

export default Setting; // Export the Setting component
