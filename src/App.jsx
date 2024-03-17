import { ToastContainer } from 'react-toastify';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import Header from './components/Header.jsx';
import Meals from './components/Meals.jsx';
import { CartContextProvider } from './store/CartContext.jsx';
import { UserProgressContextProvider } from './store/UserProgressContext.jsx';

import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} position="bottom-right" theme="dark" autoClose={ 3000 } />
    <UserProgressContextProvider>
      <CartContextProvider>
        <Header />
        <Meals />
        <Cart />
        <Checkout />
      </CartContextProvider>
    </UserProgressContextProvider>
    </>
  );
}

export default App;
