import { ChatContextProvider } from './context/chatContext';
import SideBar from './components/SideBar/SideBar';
import ChatView from './components/Chat/ChatView';
import { useEffect, useState } from 'react';
import Modal from './components/SideBar/Modal.jsx';
import Setting from './components/SideBar/Setting';
import Keycloak from 'keycloak-js';
import {httpClient} from './utils/HttpClient'

////////////////////////////////////////////////////////////////////////////////////////////////
let initOptions = {
  url: 'https://sso.trustservices.quartech.com/' , // Provide a default value if undefined
  realm: 'trust-services', // Provide a default value if undefined
  clientId: 'chatApp' // Provide a default value if undefined
};
let kc = new Keycloak(initOptions);
kc.init({
  onLoad: 'login-required',
  checkLoginIframe: false,  //maybe true?? supposed to check signin silently without page reload but causes reload currently
  pkceMethod: 'S256'
}).then((auth)=>{
  if(!auth) {
    
    window.location.reload();
  }
  else {
    console.log("Authenticated"); //remove logs in production!!
    console.log('auth', auth);
    console.log('Keycloak', kc);
    console.log('Access Token', kc.token);

    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

    kc.onTokenExpired = () => {
      console.log('token expired');
    }
  }
}, () => {
  console.error('Authentication Failed!');
});
///////////////////////////////////////////////////////////////////////////////////////////
function handleSignOut() {
  // Add your sign-out logic here
  console.log('User signed out');
  kc.logout();
  //setAuthenticated(false);
}

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const apiKey = window.localStorage.getItem('api-key');
    if (!apiKey) {
      setModalOpen(true);
    }
  }, []);



  return (
    <ChatContextProvider>
      <Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
      <div className='flex transition duration-500 ease-in-out'>
        <SideBar onSignOut={handleSignOut} />
        <ChatView />
      </div>
    </ChatContextProvider>
  );
};

export default App;
