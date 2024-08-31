import { Routes, Route, Form } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./components/Home"
import TicketForm from "./components/TicketForm"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import TicketsList from "./features/tickets/TicketsList"
import UsersList from "./features/users/UsersList"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="form" element={<TicketForm />} />
        <Route path="login" element={<Login />} />
        
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />

          <Route path="tickets">
            <Route index element={<TicketsList />}/>
          </Route>
          
          <Route path="users">
            <Route index element={<UsersList />}/>
          </Route>
        </Route>
        
      </Route>
    </Routes>
  );
}

export default App;
