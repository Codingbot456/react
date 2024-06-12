import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import '../products/flex-display.css';

function SellingProducts() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/products/subcategory/4');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('There was an error fetching the products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const { addToCart } = useContext(CartContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={`home-prods3 ${selectedProduct ? 'dimmed' : ''}`}>
            <h2>On-Selling Clothes</h2>
            <div className="item-content3">
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        product={product}
                        addToCart={addToCart}
                        setSelectedProduct={setSelectedProduct}
                    />
                ))}
            </div>
            {selectedProduct && (
                <div className="overlay">
                    <CartBuy
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onAddToCart={addToCart}
                    />
                </div>
            )}
        </div>
    );
}

const ProductCard = ({ product, addToCart, setSelectedProduct }) => {
    const handleCardClick = () => {
        setSelectedProduct(product);
    };

    return (
        <div className='new'>
            <div className='card'>
                <div className='card-gap3'>
                    <div className='card-abt3' onClick={handleCardClick}>
                        {product.image_url && <img src={product.image_url} alt={product.name} className='card-image3' />}
                    </div>
                    <div className='card-info3'>
                        <h5>{product.name}</h5>
                        <p1>{product.description}</p1>
                        <h5>Price: ${product.price}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CartBuy = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedSize, setSelectedSize] = useState('');

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCartClick = () => {
        const totalPrice = product.price * quantity;
        onAddToCart({ ...product, quantity, totalPrice, selectedColor, selectedSize });
        onClose();
    };

    return (
        <div className="buy-card-main">
           
            <div  className='cart-buy-abt'>
            <button className='close-button1' onClick={onClose}>X</button>
            {product.image_url && <img src={product.image_url} alt={product.name} className='card-image-main' />}
        </div>
        <div className='cart-buy-abt2'>
        <div className='card-info'>
                <h4>{product.name}</h4>
                        <p1>{product.description}</p1>
                        <h4>Price: ${product.price}</h4>
                </div>
            <div className='sizes'>
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                    >
                        {size}
                    </button>
                ))}
            </div>
            <div className='color-picker'>
                <p>Color:</p>
                <input type='color' value={selectedColor} onChange={handleColorChange} />
            </div>
            <div className='buys'>
                <div className='quantity'>
                    <button onClick={handleDecrement} className='quantity-btn'>-</button>
                    <span className='quantity-value'>{quantity}</span>
                    <button onClick={handleIncrement} className='quantity-btn'>+</button>
                </div>
                <button onClick={handleAddToCartClick} className='add-to-cart'>Add to Cart</button>
            </div>
            <button className='view-details'>View Details</button>
        </div>
    </div>
);
};

export default SellingProducts;
