import React from 'react'
import HomeCarousel from '../components/HomeCarousel'
import RecentItems from '../components/RecentItems'


import Hero from '../components/Hero'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
function Home() {
  useDocumentTitle("Home");
  return (<>
  
    <HomeCarousel />
    <Hero />
    <RecentItems />
  </>
  )
}

export default Home