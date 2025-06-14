import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App'
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages';
import Calendar from './pages/Calendar';
import SpecialOffers, { loader as offersLoader } from './pages/SpecialOffers';
import Reservations, { loader as reservationsLoader }  from './pages/Reservations';
import Guests, { loader as guestsLoader } from './pages/Guests';
import Invoices, { loader as invoicesLoader } from './pages/Invoices';
import Payments from './pages/Payments';
import ReservationStatus from './pages/ReservationStatus';
import RoomTypes from './pages/RoomTypes';
import Rooms from './pages/Rooms';
import Users from './pages/Users';
import Error from './pages/Error';


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
            loader: reservationsLoader,
          },
          {
            path: 'special-offers/:specialOfferId?/*',
            Component: SpecialOffers,
            loader: offersLoader,
          },
          {
            path: 'guests/:guestId?/*',
            Component: Guests,
            loader: guestsLoader,
          },
          {
            path: 'invoices/:invoiceId?/*',
            Component: Invoices,
            loader: invoicesLoader,
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
          {
            path: '*',
            Component: Error
          }
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
