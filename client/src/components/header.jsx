import ParticlesBg from "particles-bg";
import { useState, useEffect } from 'react';
// notification
import { useNotifications } from '../providers/NotificationContext';

export const Header = (props) => {

  const { createNotification } = useNotifications();
  // first time button text is 'Write a Blog Yourself' if url has no code
  const [buttonText, setButtonText] = useState('Write a Blog Yourself')

  useEffect(() => {
    // if window url has code then toggle editor
    if (window.location.href.includes('code=')) {
      setButtonText('Write a Blog Yourself');
      const button = document.querySelector('.btn-custom');
      button.style.removeProperty('color');
      button.classList.add('btn-lg');
    } else {
      // first time
      setButtonText('Authenticate with Github');
      const button = document.querySelector('.btn-custom');
      button.style.color = 'black';
    }
  }, [])

  const handleClick = async () => {

    // if window url has github login code then toggle editor
    const urlParams = window.location.href;
    const code = urlParams.split('code=')[1];

    if (code) {
      // get access token
      if (!props.user.login) {
        // create notification that data is loading
        createNotification('info', 'Loading...', 'Please wait');
        await fetch(`${process.env.REACT_APP_PROXY_URL}/getAccessToken?code=${code}`, {
          method: 'GET',
        })
          .then((res) => res.json())
          .then(async (data) => {
            const access_token = data.access_token;
            // get username
            await fetch(`${process.env.REACT_APP_PROXY_URL}/getUserData`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }).then((data) => data.json()).then((data) => {
              if (data.message === 'Bad credentials') {
                window.location.href = '/';
              }
              //save data.login (username, email, name) to state
              props.setUser({
                username: String(data.login),
                email: String(data.email),
                name: String(data.name),
              });
              // create notification
              createNotification('success', `Started session as ${data.login}!`, "Welcome!");
            }).catch((err) => console.log(err));

          }).catch((err) => console.log(err));
      }

      // toggle editor according to state
      setButtonText((prev) => prev === 'Write a Blog Yourself' ? 'About' : 'Write a Blog Yourself');
      props.toggleFunction((editor) => !editor)
    } else {
      // else redirect to github login
      window.location.assign(`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`);
    }
  }


  return (
    <header id='header'>
      <div className='intro'>
        <ParticlesBg type="circle" bg={{ zIndex: 0, position: "absolute", top: 0 }} />
        <div className='overlay'>
          <div className='container'>

            <div className='row'>
              <div className='col-md-8 col-md-offset-2 intro-text'>
                <h1>
                  {props.data ? props.data.title : 'Loading'}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : 'Loading'}</p>
                <a
                  className='btn btn-custom btn-lg page-scroll'
                  onClick={handleClick}
                  style={{ cursor: 'pointer' }}
                >
                  {buttonText}
                </a>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
