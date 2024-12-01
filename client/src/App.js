import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./components/Home"
import TicketForm from "./components/TicketForm"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import TicketsList from "./features/tickets/TicketsList"
import EditTicket from "./features/tickets/EditTicket"
import NewTicketForm from "./features/tickets/NewTicketForm"
import UsersList from "./features/users/UsersList"
import EditUser from "./features/users/EditUser"
import NewUserForm from "./features/users/NewUserForm"
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="form" element={<TicketForm />} />
        <Route path="login" element={<Login />} />
        
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />

              <Route path="tickets">
                <Route index element={<TicketsList />}/>
                <Route path=":id" element={<EditTicket />}/>
                <Route path="new" element={<NewTicketForm />}/>
              </Route>
              
              <Route path="users">
                <Route index element={<UsersList />}/>
                <Route path=":id" element={<EditUser />}/>
                <Route path="new" element={<NewUserForm />}/>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
