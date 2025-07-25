import React, { useState } from "react";
import { FaSpinner, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeFromWishlist } from "../../redux/wishlist/wishlistThunk";
import toast from "react-hot-toast";
import { useCart } from "../../hooks/useCart";

const WishlistCard = ({ item }) => {
  const listItem = item?.data?.product || item?.product;
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  console.log("WishlistCard item:", item);

  const dispatch = useDispatch();
  const {  addItemToCart, getProductCartItems } = useCart();

  // Check if any variant of this product is in cart
  const productCartItems = getProductCartItems(listItem?.id);
  console.log("item in cart:", productCartItems);
  const isProductInCart = productCartItems.length > 0;

  const handleRemove = async () => {
    try {
      const idToRemove = item?.id;
      if (!idToRemove) return toast.error("Invalid item");

      await dispatch(removeFromWishlist({ item_id: idToRemove })).unwrap();
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err?.message || "Failed to remove item");
    }
  };

  const handleAddToCart = async () => {
    if (!listItem?.id) {
      toast.error("Invalid product");
      return;
    }

    if (isProductInCart) {
      toast("This product is already in your cart", {
        icon: "ℹ️",
        style: {
          borderRadius: "10px",
          background: "#22c55e",
          color: "#fff",
        },
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      // Get the first available variant or add without variant if no variants exist
      const variants = listItem?.variants_details || [];

      if (variants.length > 0) {
        // If product has variants, use the first available one
        const firstVariant = variants[0];
        const options = {
          color: firstVariant.color || null,
          standard_size: firstVariant.standard_size || null,
          quantity: 1,
          custom_size_unit: null,
          custom_size_value: null,
        };

        await addItemToCart(listItem.id, options);
      } else {
        // If no variants, add product without variant options
        await addItemToCart(listItem.id, { quantity: 1 });
      }

      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);

      // Handle different types of errors
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message || error.response?.data?.error;
        toast.error(errorMessage || "Failed to add item to cart");
      } else if (error.response?.status === 404) {
        toast.error("Product not found");
      } else if (error.response?.status >= 500) {
        toast.error("Network error. Please try again later.");
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="relative ">
      <div className="flex flex-col md:flex-row md:h-[212px]">
        {/* Image Section */}
        <div className="relative w-full md:w-[234px] flex-shrink-0 h-[200px] md:h-full ">
          <img
            src={listItem?.image_url || "/placeholder.svg"}
            alt={listItem?.title}
            className="w-full h-full object-cover"
          />

          {/* Verified Badge */}
          {item.isVerified && (
            <div className="absolute bottom-2 right-2 md:right-4 bg-primary-900 text-white px-2 py-1 rounded-full flex items-center text-xs">
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

        {/* Content Section */}
        <div className="flex flex-1 bg-white pt-2 md:px-4 md:shadow-sm justify-between">
          <div className="flex-1 mx-2 md:mx-0">
            <div className="text-[17.63px] md:text-[20.63px] font-bold text-primary mb-1">
              ₦ {listItem?.price.toLocaleString("en-NG")}
            </div>

            <h3 className="font-medium text-[15.43px] md:text-base line-clamp-2 mb-1 text-gray-900">
              {listItem?.title}
            </h3>

            {/* <div className="flex items-center text-secondary pt-1 md:pt-3">
              <FaStar className="fill-secondary text-secondary" size={12} />
              <span className="text-xs ml-1 mt-1">{item?.rating || 0}</span>
            </div> */}

            <div className="mt-8 flex items-center gap-4 text-xs text-primary-900 my-2">
              <span className="bg-primary-50 p-1">
                {item.brand || "Brand New"}
              </span>
              <span className="bg-primary-50 p-1">
                {item.location || "Location"}
              </span>
            </div>

            <div className="mb-3 md:mb-0">
              {/* come back to this to view product details */}
              <Link
                to={`/product/${item.product?.slug}`}
                className="text-secondary text-sm font-medium"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4 gap-6">
        <div>
          <button
            onClick={handleRemove}
            className="border-1 border-primary text-primary rounded-sm px-2 py-1 flex items-center gap-2 whitespace-nowrap text-sm"
          >
            Remove Product
            <MdDelete className="text-primary" size={16} />
          </button>
        </div>
        <div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`border-1 rounded-sm px-2 py-1 flex items-center gap-2 whitespace-nowrap text-sm transition-colors ${
              isProductInCart
                ? "bg-primary border-primary text-white cursor-default"
                : "bg-primary border-primary text-white hover:bg-primary/90"
            } ${isAddingToCart ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isAddingToCart ? (
              <>
                <FaSpinner className="animate-spin text-white" size={16} />
                Adding...
              </>
            ) : isProductInCart ? (
              <>
                In Cart
                <LuShoppingCart className="text-white" size={16} />
              </>
            ) : (
              <>
                Add to cart
                <LuShoppingCart className="text-white" size={16} />
              </>
            )}
          </button>
        </div>
        {/* <div>
          <button className="border-1 bg-primary border-primary text-white rounded-sm px-2 py-1 flex items-center gap-2 whitespace-nowrap text-sm">
            Add to cart
            <LuShoppingCart className="text-white" size={16} />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default WishlistCard;
