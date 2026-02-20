import { Outlet } from "react-router-dom"
import Navbar from "./componets/Navbar"
import Sidebar from "./componets/Sidebar"
import Widget from "./componets/Widget"
import ThemeModal from "./componets/ThemeModal"
import { useSelector } from "react-redux"
import { useEffect } from "react"

const RootLayout = () => {
  const { themeModalIsOpen } = useSelector(state => state?.ui)
  const { primaryColor, backgroundColor } = useSelector(state => state?.ui.theme)
  

  useEffect(() => {
    const body = document.body;
    body.className = `${primaryColor} ${backgroundColor}`
  },[primaryColor, backgroundColor])

  return (
    <>
      <Navbar />
      <main className="main">
        <div className="container main__container">
          <Sidebar />
          <Outlet/>
          <Widget />
          {themeModalIsOpen && <ThemeModal/>}
        </div>
      </main>
    </>
  )
}

export default RootLayout