import React from 'react';
import TransactionOverviewCard from './TransactionOverviewCard';
import Notes from './Notes';

const ReservationOverview: React.FC = () => {
  const reservation = {
    tenantName: 'John Doe',
    reservationId: '12345',
    roomNumber: '101',
    checkInDate: '2023-10-01',
    checkOutDate: '2023-10-05',
    deposit: 100,
    totalCharge: 500,
    paymentDue: 400,
    notes: [
      {
        note: 'Tenant is regular',
        employeeName: 'Jane Smith',
        dateStamp: '2023-10-01'
      }
    ]
  };

  return (
    <div>
      <h2>Reservation Overview</h2>
      <p>Tenant Name: {reservation.tenantName}</p>
      <p>Reservation ID: {reservation.reservationId}</p>
      <button>Checkout</button>
      <button>Extend Stay</button>
      <TransactionOverviewCard
        roomNumber={reservation.roomNumber}
        checkInDate={reservation.checkInDate}
        checkOutDate={reservation.checkOutDate}
        deposit={reservation.deposit}
        totalCharge={reservation.totalCharge}
        paymentDue={reservation.paymentDue}
      />
      <Notes notes={reservation.notes} />
    </div>
  );
};

export default ReservationOverview;