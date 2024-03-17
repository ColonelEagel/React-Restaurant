import { createContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }
    toast.success(`${action.item.name} added`)
    // Save updated items to local storage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    return { ...state, items: updatedItems };
  }

  if (action.type === 'REMOVE_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
      console.log(existingCartItem.name)
      toast.success(`${existingCartItem.name} deleted`)
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }
// Save updated items to local storage
localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    return { ...state, items: updatedItems };
  }

  if (action.type === 'CLEAR_CART') {
    // Clear cart items from local storage
    localStorage.removeItem('cartItems');
    return { ...state, items: [] };
  }

  if (action.type === 'INITIALIZE_CART') {
    // Initialize cart with items from local storage
    return { ...state, items: action.items };
  }

  return state;

}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });
  useEffect(() => {
    // Load cart items from local storage when component mounts
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      dispatchCartAction({ type: 'INITIALIZE_CART', items: storedCartItems });
    }
  }, []);
  function addItem(item) {
    dispatchCartAction({ type: 'ADD_ITEM', item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', id });
  }

  function clearCart() {
    dispatchCartAction({ type: 'CLEAR_CART' });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
