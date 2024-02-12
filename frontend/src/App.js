import { Route, Routes } from 'react-router-dom';
import './App.css';

import Header from './components/Header';

import Login from './pages/Auth/Login';
import Registration from './pages/Auth/Registration';

import DecorationsPage from './pages/Decorations';

import EquipmentPage from './pages/Equipment/Equipment';

import IngridientsPage from './pages/Ingredients';

import OrderPage from './pages/Orders/OrderPage';
import AddOrder from './components/Orders/AddOrder';
import OrdersHistory from './pages/OrdersHistory/OrdersHistory';

import SchemasPage from './pages/Schemas';
import Goods from './pages/Specification/Goods';
import GoodSpecification from './pages/Specification/GoodSpecification';
import Gantt from './pages/Gantt';
import AddSpecification from './components/Specification/AddSpecification';
import Reports from './pages/Reports';


function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<OrderPage />} />
          <Route path='/add-order' element={<AddOrder />} />
          <Route path='/edit-order/:orderId' element={<AddOrder />} />
          <Route path='/orders-history' element={<OrdersHistory />} />

          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/registration/:isCreateClient' element={<Registration />} />

          <Route path='/equipment' element={<EquipmentPage />} />

          <Route path='/ingridients' element={<IngridientsPage />} />

          <Route path='/decorations' element={<DecorationsPage />} />

          <Route path='/schemas' element={<SchemasPage />} />

          <Route path='/specify' element={<Goods />} />
          <Route path='/specify/:goodId' element={<GoodSpecification />} />
          <Route path='/specify/:action/:goodId' element={<AddSpecification />} />


          <Route path='/gantt/:id' element={<Gantt />} />
          
          <Route path='/reports' element={<Reports />}/>

        </Routes>
      </main>
    </div>
  );
}

export default App;
