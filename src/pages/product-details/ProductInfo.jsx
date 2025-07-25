
import { useState, useEffect, useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import StarRating from "../../utils/star-rating";
import { useCart } from "../../hooks/useCart";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/wishlist/wishlistThunk";

// Import separated components
import ColorSelector from "./product-info/ColorSelector";
import SizeSelector from "./product-info/SizeSelector";
import QuantityControls from "./product-info/QuantityControl";
import ActionButtons from "./product-info/ActionButtons";

export default function ProductInfo({
  name,
  category,
  rating,
  reviews,
  price,
  variants = [],
  productId,
}) {
  // Extract unique colors and sizes from variants (memoized to prevent recreation)
  const availableColors = useMemo(() => {
    const colors = [...new Set(variants.map((v) => v.color))].filter(Boolean);
    return colors;
  }, [variants]);

  const availableSizes = useMemo(() => {
    const sizeMap = new Map();

    variants.forEach((variant) => {
      // Handle standard sizes
      if (variant.standard_size) {
        const key = `standard_${variant.standard_size}`;
        if (!sizeMap.has(key)) {
          sizeMap.set(key, {
            type: "standard",
            value: variant.standard_size,
            display: variant.standard_size,
            key: key,
          });
        }
      }

      // Handle custom sizes
      if (variant.custom_size_value) {
        const display = variant.custom_size_unit
          ? `${variant.custom_size_value.slice(0, -3)} ${
              variant.custom_size_unit
            }`
          : variant.custom_size_value.toString();

        const key = `custom_${variant.custom_size_value}_${
          variant.custom_size_unit || "no_unit"
        }`;

        if (!sizeMap.has(key)) {
          sizeMap.set(key, {
            type: "custom",
            value: variant.custom_size_value,
            unit: variant.custom_size_unit,
            display: display,
            key: key,
          });
        }
      }
    });

    return Array.from(sizeMap.values());
  }, [variants]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  // Cart hook
  const {
    isInCart,
    getCartItem,
    getProductCartItems,
    toggleCartItem,
    removeItemFromCart,
    isLoading: cartLoading,
    error: cartError,
  } = useCart();

  const { data: wishlistData } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistData?.items?.some(
    (item) => item.product?.id === productId
  );

  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Get all cart items for this product
  const allProductCartItems = getProductCartItems(productId);

  // Get current variant based on selections
  const currentVariant = variants.find((v) => {
    if (!selectedColor || !selectedSize) return false;

    const colorMatch = v.color === selectedColor;

    if (selectedSize.type === "standard") {
      return colorMatch && v.standard_size === selectedSize.value;
    } else if (selectedSize.type === "custom") {
      return (
        colorMatch &&
        v.custom_size_value === selectedSize.value &&
        v.custom_size_unit === selectedSize.unit
      );
    }

    return false;
  });

  // Display price (use override if available)
  const displayPrice = currentVariant?.price_override || price;

  // Check if current configuration is in cart
  const itemInCart = isInCart(productId, selectedColor, selectedSize);
  const cartItem = getCartItem(productId, selectedColor, selectedSize);

  // Check if product has variants
  const hasVariants = availableColors.length > 0 || availableSizes.length > 0;

  useEffect(() => {
    if (allProductCartItems.length > 0) {
      // If there's only one cart item for this product, use its variant details
      if (allProductCartItems.length === 1) {
        const cartItem = allProductCartItems[0];
        const cartColor =
          cartItem.user_selected_variant?.color || cartItem.color;

        // Handle size from cart item
        const cartStandardSize =
          cartItem.user_selected_variant?.standard_size ||
          cartItem.standard_size;
        const cartCustomSize =
          cartItem.user_selected_variant?.custom_size_value ||
          cartItem.custom_size_value;
        const cartCustomUnit =
          cartItem.user_selected_variant?.custom_size_unit ||
          cartItem.custom_size_unit;

        if (cartColor && availableColors.includes(cartColor)) {
          setSelectedColor(cartColor);
        }

        // Find matching size object
        if (cartStandardSize) {
          const matchingSize = availableSizes.find(
            (size) =>
              size.type === "standard" && size.value === cartStandardSize
          );
          if (matchingSize) {
            setSelectedSize(matchingSize);
          }
        } else if (cartCustomSize) {
          const matchingSize = availableSizes.find(
            (size) =>
              size.type === "custom" &&
              size.value === cartCustomSize &&
              size.unit === cartCustomUnit
          );
          if (matchingSize) {
            setSelectedSize(matchingSize);
          }
        }

        setQuantity(cartItem.quantity || 1);
      }
    }
  }, [productId, availableColors, availableSizes]);

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);

    // Reset size if the selected color doesn't have the current size
    if (selectedSize) {
      const hasSize = variants.some((v) => {
        if (v.color !== color) return false;

        if (selectedSize.type === "standard") {
          return v.standard_size === selectedSize.value;
        } else if (selectedSize.type === "custom") {
          return (
            v.custom_size_value === selectedSize.value &&
            v.custom_size_unit === selectedSize.unit
          );
        }

        return false;
      });

      if (!hasSize) {
        // Find first available size for this color
        const firstVariant = variants.find((v) => v.color === color);
        if (firstVariant) {
          let firstSize = null;

          if (firstVariant.standard_size) {
            firstSize = availableSizes.find(
              (size) =>
                size.type === "standard" &&
                size.value === firstVariant.standard_size
            );
          } else if (firstVariant.custom_size_value) {
            firstSize = availableSizes.find(
              (size) =>
                size.type === "custom" &&
                size.value === firstVariant.custom_size_value &&
                size.unit === firstVariant.custom_size_unit
            );
          }

          setSelectedSize(firstSize);
        } else {
          setSelectedSize(null);
        }
      }
    }
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle quantity increment
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handle quantity decrement
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Handle add to cart / remove from cart
  const handleCartAction = async () => {
    // For remove action, if item is in cart, remove it
    if (itemInCart && cartItem) {
      setIsProcessing(true);

      try {
        await removeItemFromCart(cartItem.id);
        toast.success("Item removed from cart");
      } catch (error) {
        toast.error("Failed to remove item from cart");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Validation
    if (!productId) {
      toast.error("Product ID is required");
      return;
    }

    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    // Check if the selected variant combination exists
    if (selectedColor && selectedSize && !currentVariant) {
      toast.error(
        `This product is not available in ${selectedColor} color and size ${selectedSize}. Please select a different size or color.`
      );
      return;
    }

    if (currentVariant && currentVariant.stock_quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity <= 0) {
      toast.error("Please select a valid quantity");
      return;
    }

    setIsProcessing(true);

    try {
      const options = {
        color: selectedColor,
        standard_size:
          selectedSize?.type === "standard" ? selectedSize.value : null,
        custom_size_value:
          selectedSize?.type === "custom" ? selectedSize.value : null,
        custom_size_unit:
          selectedSize?.type === "custom" ? selectedSize.unit : null,
        quantity,
      };

      const result = await toggleCartItem(productId, options);
      toast.success("Item added to cart");
    } catch (error) {
      toast.error("Failed to add item to cart");
      // Handle different types of errors
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message || error.response?.data?.error;

        if (
          errorMessage &&
          (errorMessage.toLowerCase().includes("variant") ||
            errorMessage.toLowerCase().includes("combination") ||
            errorMessage.toLowerCase().includes("not available") ||
            errorMessage.toLowerCase().includes("invalid"))
        ) {
          toast.error(
            `This variant combination (${
              selectedColor ? `${selectedColor} color` : ""
            }${selectedColor && selectedSize ? ", " : ""}${
              selectedSize ? `size ${selectedSize}` : ""
            }) is not available for this product.`
          );
        } else if (
          errorMessage &&
          errorMessage.toLowerCase().includes("stock")
        ) {
          toast.error(
            "This variant is out of stock. Please select a different combination."
          );
        } else {
          toast.error(
            errorMessage ||
              "This variant combination is not available. Please select a different combination."
          );
        }
      } else if (error.response?.status === 404) {
        toast.error(
          "Product not found. Please refresh the page and try again."
        );
      } else if (error.response?.status >= 500) {
        toast.error("Network error. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to add item to cart. Please try again."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWishlistAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsWishlistLoading(true);
      if (isWishlisted) {
        const wishlistItem = wishlistData.items.find(
          (item) => item.product?.id === productId
        );
        if (wishlistItem) {
          await dispatch(
            removeFromWishlist({ item_id: wishlistItem.id })
          ).unwrap();
          toast.success("Removed from wishlist");
        }
      } else {
        await dispatch(addToWishlist({ product_id: productId })).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Error updating wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-lg md:text-2xl lg:text-xl xl:text-4xl font-bold mb-1">
        {name}
      </h1>
      <p className="text-gray-600 mb-2 md:text-xl lg:text-lg xl:text-xl">
        {category}
      </p>

      {/* Ratings */}
      <div className="flex items-center mb-4">
        <StarRating
          rating={rating}
          reviews={reviews || 0}
          size={18}
          showReviewCount={true}
          showAverageRating={false}
        />
      </div>

      {/* Price */}
      <div className="md:text-xl lg:text-xl xl:text-3xl font-bold mb-4 mt-6">
        ₦{" "}
        {displayPrice
          ? Number(
              typeof displayPrice === "string"
                ? displayPrice.replace(/[^\d.-]/g, "")
                : displayPrice
            ).toLocaleString("en-NG", {
              maximumFractionDigits: 0,
            })
          : "0"}
      </div>

      {/* Color and Quantity Section - Fixed Layout */}
      <div className="my-6">
        {hasVariants ? (
          // Layout when variants exist
          <div className="flex justify-between items-start">
            <ColorSelector
              availableColors={availableColors}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />

            <div className="ml-6">
              <QuantityControls
                quantity={quantity}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                currentVariant={currentVariant}
              />
            </div>
          </div>
        ) : (
          // Layout when no variants - quantity control positioned normally
          <div className="flex justify-start">
            <QuantityControls
              quantity={quantity}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
              currentVariant={currentVariant}
            />
          </div>
        )}
      </div>

      {/* Size options */}
      <SizeSelector
        availableSizes={availableSizes}
        selectedSize={selectedSize}
        onSizeSelect={handleSizeSelect}
      />

      {/* Stock information */}
      {currentVariant && (
        <div className="mb-4 text-sm text-gray-600">
          {currentVariant.stock_quantity > 0
            ? currentVariant.stock_quantity < 5
              ? `${currentVariant.stock_quantity} in stock`
              : "In stock"
            : "Out of stock"}
        </div>
      )}

      {/* Action buttons */}
      <ActionButtons
        itemInCart={itemInCart}
        isProcessing={isProcessing}
        cartLoading={cartLoading}
        currentVariant={currentVariant}
        isWishlisted={isWishlisted}
        isWishlistLoading={isWishlistLoading}
        onCartAction={handleCartAction}
        onWishlistAction={handleWishlistAction}
      />
    </div>
  );
}