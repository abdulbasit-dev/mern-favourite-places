import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import MainHeader from './MainHeader'

import './MainNavigation.css'
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import Backdrop from '../../../shared/components/UIElements/Backdrop'


function MainNavigation() {
  const [draweIsOpen, setDraweIsOpen] = useState(false)

  function handleOpen(){
    setDraweIsOpen(true)
  }

  function handleClose(){
    setDraweIsOpen(false)
  }

  return (
    <React.Fragment>
      {draweIsOpen && <Backdrop onClick={handleClose}/>}
     
      <SideDrawer show={draweIsOpen} onClick={handleClose}>
        <nav className="main-navigation__drawer-nav">    
          <NavLinks/>
        </nav>
      </SideDrawer>
      
    
      <MainHeader onClick={handleClose}>
        <button className="main-navigation__menu-btn" onClick={handleOpen}>
          <span/>
          <span/>
          <span/>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlace</Link>
        </h1>
        <nav className="main-navigation__header-nav">    
          <NavLinks/>
        </nav>
      </MainHeader>
    </React.Fragment>
  )
}

export default MainNavigation
