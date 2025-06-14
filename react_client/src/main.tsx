import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App'
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages';
import Calendar from './pages/Calendar';
import SpecialOffers from './pages/SpecialOffers';
import Reservations from './pages/Reservations';
import Guests from './pages/Guests';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import ReservationStatus from './pages/ReservationStatus';
import RoomTypes from './pages/RoomTypes';
import Rooms from './pages/Rooms';
import Users from './pages/Users';


const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: DashboardLayout,
        children: [
          {
            path: '',
            Component: HomePage,
          },
          {
            path: 'calendar',
            Component: Calendar,
          },
          {
            path: 'reservations/:reservationId?/*',
            Component: Reservations,
          },
          {
            path: 'special-offers/:specialOfferId?/*',
            Component: SpecialOffers,
          },
          {
            path: 'guests/:guestId?/*',
            Component: Guests,
          },
          {
            path: 'invoices/:invoiceId?/*',
            Component: Invoices,
          },
          {
            path: 'payments/:paymentId?/*',
            Component: Payments,
          },
          {
            path: 'reservation-statuses/:reservationStatusId?/*',
            Component: ReservationStatus,
          },
          {
            path: 'room-types/:roomTypeId?/*',
            Component: RoomTypes,
          },
          {
            path: 'rooms/:roomId?/*',
            Component: Rooms,
          },
          {
            path: 'users/:userId?/*',
            Component: Users,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
