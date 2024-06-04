import { useState, useEffect } from 'react'
import { Navigation } from './components/navigation'
import { Header } from './components/header'
import { Features } from './components/features'
// import { Signup } from './components/signup'
import JsonData from './data/data.json'
import SmoothScroll from 'smooth-scroll'
import MarkdownProvider from './providers/markdown-provider'

import MainLayout from './components/main-layout/main-layout';
import Editor from './components/editor/editor';
import Preview from './components/preview/preview';
import { Signup } from './components/signup'

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
})

const App = () => {
  const [landingPageData, setLandingPageData] = useState({})
  const [user, setUser] = useState({})
  const [editor, setEditor] = useState(false)
  useEffect(() => {
    setLandingPageData(JsonData)
  }, [])




  return (
    <MarkdownProvider>
      <Navigation />
      <Header data={landingPageData.Header} toggleFunction={setEditor} setUser={setUser} user={user} />
      {!editor && <div className='landing'>
        <Features data={landingPageData.Features} />
        <Signup data={landingPageData.About} />
        {/* <Testimonials data={landingPageData.Testimonials} /> */}
      </div>}
      {editor && <MainLayout className='Editor'>
        <MainLayout.Column>
          <Editor user={user} />
        </MainLayout.Column>
        <MainLayout.Column>
          <Preview />
        </MainLayout.Column>
      </MainLayout>}
    </MarkdownProvider>
  )
}

export default App
