import { useRoutes } from "react-router-dom"
import Home from "./pages/home"
import Shop from "./pages/shop"
import ProductDetail from "./pages/product"
import Header from "./components/header/Header"
import User from "./pages/user/user"

const App = () => {
  return (
    <div>
      <Header/>
      {
        useRoutes([
          {path:"/", element:<Home/>},
          {path:"/shop", element:<Shop/>},
          {path:"/user", element:<User/>},
          {path:"/product/:id", element:<ProductDetail />}
        ])
      }
    </div>
  )
}

export default App