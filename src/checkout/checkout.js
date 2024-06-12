import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './checkout.css';

const CheckoutForm = () => {
  const { cartItems } = useContext(CartContext);
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    items: cartItems ? cartItems.map(item => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      subtotal_price: item.totalPrice,
      image_url: item.image_url
    })) : []
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const total_price = formData.items.reduce((total, item) => total + item.subtotal_price, 0);
    const dataToSend = { ...formData, total_price };

    try {
      const response = await axios.post('http://localhost:4000/api/orders/orders', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.status === 200) {
        throw new Error('Failed to create order');
      }

      const data = await response.data;
      navigate('/payment', { state: { formData: dataToSend } });
    } catch (error) {
      console.error('Error creating order:', error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotalPrice = () => {
    return formData.items.reduce((total, item) => total + item.subtotal_price, 0).toFixed(2);
  };

  return (
    <div className="checkout-container">
    <form onSubmit={handleSubmit}>
      {/* Customer Details Input Fields */}
      <div className='order-form'>
      <label>
        User Name:
        <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Phone Number:
        <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
      </label>
      <label>
        Address:
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </label>
      <label>
        City:
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </label>
      <label>
        State:
        <input type="text" name="state" value={formData.state} onChange={handleChange} required />
      </label>
      <label>
        Zip Code:
        <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} required />
      </label>
      </div>
      {/* Items Input Fields */}
      <div className='order-form1'>
      <h3>Items</h3>
      {formData.items.map((item, index) => (
        <div key={index} className="item-summary">
          <img src={item.image_url} alt={item.name} className="item-image" />
          <div>
            <p>{item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal Price: ${item.subtotal_price.toFixed(2)}</p>
          </div>
        </div>
      ))}


      {/* Display total price */}
      <div className="total-price">
        <h3>Total Price: ${calculateTotalPrice()}</h3>
      </div>
      <button type="submit">Place Order</button>
      </div>
     
    </form>
    </div>
  );
};

export default CheckoutForm;
