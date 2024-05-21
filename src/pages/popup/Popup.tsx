import React, { useEffect, useState } from 'react';

import logo from '../../assets/img/icon-128.png';
import gitHubLogo from '../../assets/img/github-icon.svg';
import linkedinLogo from '../../assets/img/linkedin-logo.svg';
import checkIcon from '../../assets/img/check-svgrepo-com.svg';
import close from '../../assets/img/close.svg';
import './Popup.css';

import { getCurrentTab } from '../background';

import { sendMessage, getURLwithCode } from '../utils';

import Loader from './components/loader/Loader';
import RepositoryList from './components/repository-list/RepositoryList';
import Button from './components/button/Button';

const Popup: React.FC = () => {
  const [repositories, setRepositories] = useState([]);
  const [userId, setUserId] = useState('');
  const [isGitHubPage, setIsGitHubPage] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataReceived, setDataReceived] = useState(false);

  useEffect(() => {
    getCurrentTab(currentTab => {
      setIsGitHubPage(currentTab?.url?.includes('github.com'));
    });

    chrome.storage.local.get('accessToken', result => {
      const accessToken = result.accessToken;
      if (!accessToken) {
        try {
          getURLwithCode().then(() => {});
        } catch (error) {
          console.log('Failed to get the Token: ', error);
        }

        chrome.runtime.onMessage.addListener(message => {
          if (message.type === 'SENDING_ACCESS_TOKEN') {
            console.log('Message in popup from SENDING_ACCESS_TOKEN: ', message);
            setAccessToken(message.accessToken);
          }
        });
      } else {
        setAccessToken(accessToken);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['repositoriesData', 'userId'], result => {
      if (result.repositoriesData) {
        setRepositories(result.repositoriesData);
        setUserId(result.userId);
        setDataReceived(true);
        setLoading(false);
      } else {
        accessToken && sendMessage('REQUEST_DATA', { dataReceived, accessToken });
      }
    });

    if (!dataReceived && accessToken) {
      chrome.runtime.onMessage.addListener(message => {
        if (message.type === 'REPOSITORIES_DATA_POPUP') {
          chrome.storage.local.set({ repositoriesData: message.data, userId: message.userId });
          setRepositories(message.data);
          setUserId(message.userId);
          setLoading(false);
          setDataReceived(true);
        }
      });
    }
  }, [accessToken, dataReceived]);

  const deleteAccessToken = () => {
    setAccessToken(null);
    chrome.storage.local.remove(['repositoriesData', 'accessToken', 'userId']);
  };

  const goToPageById = (repoUrl: string) => {
    chrome.runtime.sendMessage({
      type: 'NEW_URL',
      newUrl: repoUrl,
    });
  };

  const updateData = () => {
    setLoading(true);
    setDataReceived(false);
    chrome.storage.local.remove(['repositoriesData', 'userId']);
    sendMessage('REQUEST_DATA', { dataReceived: false, accessToken });
  };

  const otherRepositories = repositories
    ?.filter(repo => repo.owner.id !== userId)
    .sort((a, b) => a.name.localeCompare(b.name));
  const userRepositories = repositories
    ?.filter(repo => repo.owner.id === userId)
    .sort((a, b) => a.name.localeCompare(b.name));

  return isGitHubPage ? (
    <div className="App">
      {loading || !accessToken ? (
        <Loader />
      ) : (
        <>
          <div className="relative">
            <div>
              <img className="rounded-full mx-auto" src={logo} alt="GitHub NavEase Logo" />
              <header className="App-header">GitHub NavEase</header>
            </div>
            <div className="absolute top-0">
              <h3 className="text-white">
                Developed by{' '}
                <a className="underline" href="https://michel-machado.vercel.app/">
                  Michel Machado
                </a>
              </h3>
              <div className="flex gap-2 mt-2">
                <a href="https://www.linkedin.com/in/michel-machado-23a749a3/">
                  <img width="20px" src={linkedinLogo} alt="Linkedin Logo" />
                </a>
                <a href="https://github.com/MichelHMachado">
                  <img width="20px" src={gitHubLogo} alt="Github Logo" />
                </a>
              </div>
            </div>
          </div>

          <h1 className="App-container__heading">Effortlessly Navigate to Your Repositories</h1>
          <div className="App-container">
            <div>
              <RepositoryList
                repositories={otherRepositories}
                title="User's Not Authored Repositories"
                onClick={goToPageById}
              />
            </div>

            <div>
              <RepositoryList
                repositories={userRepositories}
                title="User's Authored Repositories"
                onClick={goToPageById}
              />
            </div>
          </div>
          <div className="flex gap-6">
            <Button onClick={updateData} text={'Update Data'} icon={checkIcon} buttonClass="is--green" />
            <Button icon={close} onClick={deleteAccessToken} text="Delete Token" />
          </div>
        </>
      )}
    </div>
  ) : (
    <h1 className="warning-text">This is not a GitHub page!</h1>
  );
};

export default Popup;
