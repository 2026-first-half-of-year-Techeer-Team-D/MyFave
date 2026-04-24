import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AboutPage } from '@/pages/AboutPage'
import { CartPage } from '@/pages/CartPage'
import { FAQPage } from '@/pages/FAQPage'
import { LiveChatPage } from '@/pages/LiveChatPage'
import { LoginPage } from '@/pages/LoginPage'
import { MainPage } from '@/pages/MainPage'
import { MyPage } from '@/pages/MyPage'
import { NoticePage } from '@/pages/NoticePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { OrderSuccessPage } from '@/pages/OrderSuccessPage'
import { PaymentPage } from '@/pages/PaymentPage'
import { AddShippingPage } from '@/pages/AddShippingPage'
import { CouponPage } from '@/pages/CouponPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { ProductListPage } from '@/pages/ProductListPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { Layout } from '@/shared/components/Layout'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'

const router = createBrowserRouter([
  // Auth pages (no layout)
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },

  // Pages with Header + Footer (Layout)
  {
    element: <Layout />,
    children: [
      // Public community pages
      { path: '/about', element: <AboutPage /> },
      { path: '/notice', element: <NoticePage /> },
      { path: '/faq', element: <FAQPage /> },

      // Protected pages (require login)
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/', element: <MainPage /> },
          { path: '/shop', element: <ProductListPage /> },
          { path: '/product/:id', element: <ProductDetailPage /> },
          { path: '/cart', element: <CartPage /> },
          { path: '/payment', element: <PaymentPage /> },
          { path: '/add-shipping', element: <AddShippingPage /> },
          { path: '/coupons', element: <CouponPage /> },
          { path: '/order-success', element: <OrderSuccessPage /> },
          { path: '/mypage', element: <MyPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/live-chat', element: <LiveChatPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
