import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import RootLayout from "./layouts/RootLayout";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Wishlist from "./pages/wishlist/Wishlist";
import AdminRoute from "./routes/AdminRoute";
import NotFound from "./routes/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import InitialLoader from "./components/InitialLoader";

import ProductDetails from "./pages/product-details/ProductDetails";
import CategoryPage from "./pages/category-page/CategoryPage";
import Signup from "./pages/signup/Signup";
import Signin from "./pages/signin/Signin";
import NotificationDetail from "./pages/notification/NotificationDetails";
import NotificationPage from "./pages/notification/NotificationPage";
import VerifyEmail from "./pages/verify-email/VerifyEmail";
import AccountApproval from "./pages/account-approval/AccountApproval";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import OtpVerification from "./pages/otp-verification/OtpVerification";
import ResetPassword from "./pages/reset-password/ResetPassword";
import PasswordResetSuccess from "./pages/sucessful-password-rest/PasswordResetSuccess";
import KYCVerification from "./pages/kyc/kyc-verification/KYCVerification";
import UploadID from "./pages/kyc/upload-id/UploadID";
import ProofOfAddress from "./pages/kyc/proof-of-address/ProofOfAddress";
import SocialLinksUpload from "./pages/kyc/social-links-upload/SocialLinksUpload";
import SuccessfulKYC from "./pages/kyc/successful-kyc/SuccessfulKYC";
import OrderDetails from "./pages/order-details/OrderDetails";
import Dashboard from "./sellers-dashboard/pages/home/Dashboard";
import ShopProducts from "./sellers-dashboard/pages/shop/shop-products/ShopProducts";
import ShopOrders from "./sellers-dashboard/pages/shop/shop-orders/ShopOrders";
import ReviewsPage from "./sellers-dashboard/pages/review/Reviews";
import ReviewDetails from "./sellers-dashboard/pages/review/ReviewDetailsPage";
import OrderDetailPage from "./sellers-dashboard/pages/shop/shop-orders/OrderDetails";
import Account from "./sellers-dashboard/pages/settings/account-settings/Account";
import ChatPage from "./sellers-dashboard/pages/chat/Chat";
import SupportPage from "./sellers-dashboard/pages/support/Support";
import Orders from "./users-profile/pages/order/Orders";
import UserOrderDetails from "./users-profile/pages/order/OrderDetails";
import UserProfile from "./users-profile/pages/profile/Profile";
import EditProfile from "./users-profile/pages/profile/ProfileEdit";
import UserOrders from "./users-profile/pages/order/Orders";
import UsersPage from "./admin-dashboard/pages/users/Users";
import ChangePassword from "./users-profile/pages/password/ChangePassword";
import UserInfoPage from "./admin-dashboard/pages/users/UserInfo";
import TermsAndConditions from "./pages/terms-and-conditions/TermsAndConditions";
import PrivacyPolicy from "./pages/privacy-policy/PrivacyPolicy";
import Faq from "./pages/faq/Faq";
import RefundPolicy from "./pages/refund/RefundPolicy";
import ContactUs from "./pages/contact/Contact";
import { adminNavItems, sellerNavItems, userNavItems } from "./config/navItems";
import DashboardLayout from "./layouts/DashboardLayout";
import PaymentSuccess from "./pages/checkout/PaymentSuccess";
import ProfilePage from "./pages/profile-page/ProfilePage";
import Profile from "./pages/profile-page/profile/Profile";
import Settings from "./pages/profile-page/settings/Settings";
import OrderHistory from "./pages/profile-page/order-history/OrderHistory";
import MyList from "./pages/profile-page/my-list/MyList";
import SearchResultsPage from "./pages/search-result/SearchResultsPage";
import Wallet from "./sellers-dashboard/pages/wallet/Wallet";

// Lazy load the Home page
const Home = lazy(() => import("./pages/home/Home"));

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollToTop />

      <Routes>
        <Route element={<ScrollToTop />} />
        <Route path="/" element={<RootLayout />}>
          {/* Public Routes */}
          <Route
            index
            element={
              <Suspense fallback={<InitialLoader />}>
                <Home />
              </Suspense>
            }
          />
          <Route path="product/:productSlug" element={<ProductDetails />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="products" element={<CategoryPage />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="account-approval" element={<AccountApproval />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="otp-verification" element={<OtpVerification />} />
          <Route path="/search" element={<SearchResultsPage />} />

          <Route
            path="password-reset-success"
            element={<PasswordResetSuccess />}
          />
          {/* footer links */}
          <Route path="faq" element={<Faq />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="notifications/:id" element={<NotificationDetail />} />
            <Route path="kyc-verification" element={<KYCVerification />} />
            <Route path="upload-id" element={<UploadID />} />
            <Route path="proof-of-address" element={<ProofOfAddress />} />
            <Route path="social-links-upload" element={<SocialLinksUpload />} />
            <Route path="successful-kyc" element={<SuccessfulKYC />} />
            <Route path="order-details/:orderId" element={<OrderDetails />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            {/* user profile */}
            <Route path="profile-page" element={<ProfilePage />}>
              <Route index element={<Navigate to="profile" replace />} />

              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="order-history" element={<UserOrders />} />
              <Route path="order/:id" element={<UserOrderDetails />} />
              <Route path="my-list" element={<Wishlist />} />
            </Route>
          </Route>
        </Route>

        {/* Sellers Dashboard */}
        <Route
          path="sellers-dashboard"
          element={<DashboardLayout navItems={sellerNavItems} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="shop-products" element={<ShopProducts />} />
          <Route path="shop-orders" element={<ShopOrders />} />
          <Route path="shop-order/:id" element={<OrderDetailPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="review/:id" element={<ReviewDetails />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="account-settings" element={<Account />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* Users Dashboard */}
        <Route
          path="profile"
          element={<DashboardLayout navItems={userNavItems} />}
        >
          <Route index element={<UserProfile />} />
          <Route path="edit" element={<EditProfile />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="orders/:id" element={<UserOrderDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="account-settings" element={<Account />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="admin"
          element={<DashboardLayout navItems={adminNavItems} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserInfoPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* Not Found Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
