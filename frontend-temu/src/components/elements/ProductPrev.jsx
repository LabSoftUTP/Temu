import './ProductPrev.css';
import { MdAddShoppingCart } from 'react-icons/md';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductPrev = ({ product }) => {
    // test usar como link el titulo del producto

    return (
        <Link
            to={`/product/${encodeURIComponent(product.title)}`}
            className="product-prev-link"
        >
            <div className="product-prev">
                <img src={`/products/${product.img}`} alt="" />

                <small>{product.title}</small>

                <div className="product-prev-container">
                    <div>
                        {product.offer && (
                            <>
                                <p className="product-prev-price">
                                    {product.offer}
                                </p>
                                <small className="product-prev-offer">
                                    {product.price}
                                </small>
                            </>
                        )}
                        {!product.offer && (
                            <p className="product-prev-price">
                                {product.price}
                            </p>
                        )}
                    </div>

                    <span className="product-prev-cart">
                        <MdAddShoppingCart />
                    </span>
                </div>
            </div>
        </Link>
    );
};

ProductPrev.propTypes = {
    product: PropTypes.shape({
        title: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        offer: PropTypes.string,
    }),
};

export default ProductPrev;
