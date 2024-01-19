import { useState, useEffect } from 'react'
import { Navigation } from './components/navigation'
import { Header } from './components/header'
import { Features } from './components/features'
import { About } from './components/about'
import { Footer } from './components/footer'
import JsonData from './data/data.json'
import SmoothScroll from 'smooth-scroll'
import MarkdownProvider from './providers/markdown-provider'

import MainLayout from './components/main-layout/main-layout';
import Editor from './components/editor/editor';
import Preview from './components/preview/preview';

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
})

const App = () => {
  const [landingPageData, setLandingPageData] = useState({})
  useEffect(() => {
    setLandingPageData(JsonData)
  }, [])

  const [editor, setEditor] = useState(false)



  return (
    <MarkdownProvider>
      <Navigation />
      <Header data={landingPageData.Header} toggleFunction={setEditor} />
      {!editor && <div className='landing'>
        <Features data={landingPageData.Features} />
        <About data={landingPageData.About} />
        {/* <Testimonials data={landingPageData.Testimonials} /> */}
      </div>}
      {editor && <MainLayout className='Editor'>
        <MainLayout.Column>
          <Editor />
        </MainLayout.Column>
        <MainLayout.Column>
          <Preview />
        </MainLayout.Column>
      </MainLayout>}
      <Footer />
    </MarkdownProvider>
  )
}

export default App
