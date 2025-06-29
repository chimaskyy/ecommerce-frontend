import { useState } from "react";
import { FaFire, FaRegHeart, FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsInCart(!isInCart);
    // Handle add to cart logic
    console.log("Added to cart:", product.id);
  };

  const placeholderImg =
    "https://ui-avatars.com/api/?name=Image&background=cccccc&color=ffffff&size=400";

  return (
    <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image with Overlays */}
        <div className="relative">
          <div className="aspect-square relative">
            <img
              src={placeholderImg || product.images?.[0].url}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Hot Label */}
          {product.isHot && (
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center bg-red-500 text-white px-1 py-0.5 rounded-full shadow-lg">
                <span className="font-bold text-[8px] whitespace-nowrap">
                  Hot Price
                </span>
                <FaFire className="text-white ml-1" size={10} />
              </div>
            </div>
          )}

          {/* Verified Badge */}
          {product.isVerified && (
            <div className="absolute bottom-2 right-2 bg-primary-900 text-white px-2 py-1 rounded-full flex items-center text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                className="mr-1"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M12.438 1.248c4.27 0 7.75 3.48 7.75 7.75c0 2.48-1.18 4.69-3 6.11v5.4c0 1.03 0 1.78-.69 2.12c-.17.08-.33.12-.49.12c-.5 0-.99-.36-1.61-.83l-1.21-.91l-.091-.067c-.283-.211-.57-.424-.66-.433c-.09.01-.376.222-.659.433l-.09.067l-1.2.9l-.027.02c-.816.61-1.4 1.046-2.084.7c-.69-.34-.69-1.09-.69-2.12v-5.4c-1.82-1.42-3-3.63-3-6.11c0-4.27 3.48-7.75 7.75-7.75m0 1.5c-3.45 0-6.25 2.8-6.25 6.25s2.8 6.25 6.25 6.25s6.25-2.8 6.25-6.25s-2.8-6.25-6.25-6.25m3.25 17.77v-4.49a7.7 7.7 0 0 1-6.5 0v4.99l.147-.109q.122-.089.242-.181l1.21-.91c.64-.48 1.07-.8 1.65-.8s1.01.32 1.65.8l1.2.9c.14.1.28.2.4.29zm-6.29-9.09l.25-1.68h.04l-1.15-1.2c-.3-.31-.4-.75-.26-1.16c.13-.4.47-.69.88-.76l1.57-.26l.73-1.5c.19-.39.58-.63 1-.63s.81.24 1 .63l.73 1.5l1.57.26c.41.07.75.36.88.76c.13.41.03.85-.26 1.16l-1.15 1.2l.25 1.68c.06.44-.12.86-.47 1.11c-.34.24-.79.27-1.16.07l-1.41-.75l-1.41.75c-.16.09-.34.13-.52.13c-.22 0-.45-.06-.64-.2c-.36-.25-.53-.68-.47-1.11m2.57-4.23c-.16.33-.47.56-.82.62l-1.09.18l.8.84c.24.25.35.61.3.96l-.17 1.13l.93-.49c.16-.09.34-.13.52-.13s.36.04.52.13l.93.49l-.17-1.13c-.05-.35.06-.71.3-.96l.8-.84l-1.09-.18a1.13 1.13 0 0 1-.82-.62l-.47-.97z"
                />
              </svg>
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3">
          <div className="text-primary font-bold mb-1">
            ₦
            {product?.price?.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}
          </div>

          <h3 className="font-medium text-[#333333] text-sm mb-1 line-clamp-2">
            {product.title}
          </h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-primary-900 text-[10px] whitespace-nowrap">
              {product.state} {" ,"} {product.local_govt}
            </span>
            <div className="flex items-center text-secondary">
              {product.rating && (
                <span className="text-xs">
                  <FaStar className="fill-secondary text-secondary" size={12} />
                </span>
              )}

              {product.rating && (
                <span className="text-xs ml-1">{product.rating}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            {product.condition && (
              <span className="bg-primary-100 text-primary-900 text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
                {product.condition}
              </span>
            )}

            {product.category_name && (
              <span className="bg-primary-100 text-primary-900 text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
                {product.category_name}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-2 cursor-pointer left-2 p-2 rounded-full transition-colors z-10 ${
          isWishlisted ? "bg-primary" : "bg-white"
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <FaHeart className="text-white" />
        ) : (
          <FaRegHeart className="text-primary" />
        )}
      </button>

      <button
        onClick={handleAddToCart}
        className={`absolute top-2 right-2 cursor-pointer p-2 rounded-full transition-colors z-10 ${
          isInCart ? "bg-primary" : "bg-white"
        }`}
        aria-label="Add to cart"
      >
        {isInCart ? (
          <HiShoppingCart className="text-white" />
        ) : (
          <HiOutlineShoppingCart className="text-primary" />
        )}
      </button>
    </div>
  );
}
