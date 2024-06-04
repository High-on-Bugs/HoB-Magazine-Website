import { useState } from 'react';
import TitleBar from '../title-bar/title-bar';
import { useMarkdown } from '../../providers/markdown-provider';
import './editor.css';
import { Octokit } from "@octokit/core";
import { Buffer } from 'buffer';
import { useNotifications } from '../../providers/NotificationContext';

const octokit = new Octokit({ auth: process.env.REACT_APP_OCTOKIT_API_KEY });

const Editor = (props) => {
 const [markdown, setMarkdown] = useMarkdown();
 const [words, setWords] = useState(0);
 const [chars, setChars] = useState(0);


 const { createNotification } = useNotifications();


 const getWordsCount = (str) => {
  try {
   return str.match(/(\w+)/g).length;
  } catch (e) {
   return 0;
  }
 };


 const getCharsCount = (str) => {
  try {
   return str.length;
  } catch (e) {
   return 0;
  }
 };


 const processFile = () => {
  // ask for user name through prompt
  createBranchAndUploadFile(props.user, markdown);
 };

 const createBranchAndUploadFile = async (user, body) => {

  // disable the button
  document.querySelector('#Submission').disabled = true;
  // change the button text
  document.querySelector('#Submission').innerHTML = "Submitting...";

  // get date and time
  var date = new Date().getTime();

  //bas64 encode the body
  const blog = Buffer.from(body).toString('base64');

  // use await code
  // create branch - create file - create pull request

  let branch;

  try {

   branch = await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
    owner: 'High-on-Bugs',
    repo: 'HoB-Community-Newsletter',
    ref: `refs/heads/${user.username}-submission-${date}`,
    sha: process.env.REACT_APP_MAIN_SHA,
    headers: {
     'X-GitHub-Api-Version': '2022-11-28'
    }
   });

   await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'High-on-Bugs',
    repo: 'HoB-Community-Newsletter',
    path: `news/${user.username}-${date}.md`,
    branch: `${user.username}-submission-${date}`,
    message: `Article Submission by ${user.username} on ${date}\n\n Co-authored-by: Saptarshi bhattacharyasaptarshi2001@gmail.com
    `,
    committer: {
     name: user.name,
     email: user.email
    },
    content: blog,
    headers: {
     'X-GitHub-Api-Version': '2022-11-28'
    }
   });

   var pull = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner: 'High-on-Bugs',
    repo: 'HoB-Community-Newsletter',
    head: `${user.username}-submission-${date}`,
    base: 'main',
    title: `Article Submission by ${user.username} on ${date}`,
    body: `Article Submission by ${user.username} on ${date}`,
    maintainer_can_modify: true,
    headers: {
     'X-GitHub-Api-Version': '2022-11-28'
    },
   });

   // get pull request number
   var pull = pull.data.number;
   // redirect to the pull request
   window.location.href = `https://github.com/High-on-Bugs/HoB-Community-Newsletter/pull/${pull}`;

  } catch (err) {
   // if branch is already created then delete the branch
   if (branch) {
    await octokit.request('DELETE /repos/{owner}/{repo}/git/refs/{ref}', {
     owner: 'High-on-Bugs',
     repo: 'HoB-Community-Newsletter',
     ref: `heads/${user.username}-submission-${date}`,
     headers: {
      'X-GitHub-Api-Version': '2022-11-28'
     }
    });
   }
   createNotification('error', err.message, "Error");

   branch = null;
   // enable the button
   document.querySelector('#Submission').disabled = false;
   // change the button text
   document.querySelector('#Submission').innerHTML = "Submit!";
  }
 }

 const updateMarkdown = (event) => {
  const value = event.target.value;

  setMarkdown(value);
  setWords(getWordsCount(value));
  setChars(getCharsCount(value));
 };

 return (
  <div className="editor__wrap">
   <TitleBar title="Editor" aside={`${words} Words ${chars} Characters`} />
   <textarea
    className="editor"
    value={markdown}
    onChange={updateMarkdown}
   />
   <button onClick={processFile} id="Submission">Submit!</button>
  </div>
 );
}

export default Editor;
