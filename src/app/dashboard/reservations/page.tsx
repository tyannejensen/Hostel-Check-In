import React from 'react';
import Reservations from './reservations';
import ReservationOverview from './reservationOverview';

export default function Page() {
  return (
    <div>
      <h1>Reservations</h1>
      <p>Manage reservations</p>
      <Reservations />
      <ReservationOverview />
    </div>
  );
}