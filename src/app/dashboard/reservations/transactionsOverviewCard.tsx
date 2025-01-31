import React from 'react';

interface TransactionOverviewCardProps {
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  deposit: number;
  totalCharge: number;
  paymentDue: number;
}

const TransactionOverviewCard: React.FC<TransactionOverviewCardProps> = ({
  roomNumber,
  checkInDate,
  checkOutDate,
  deposit,
  totalCharge,
  paymentDue
}) => {
  return (
    <div>
      <h3>Transaction Overview</h3>
      <p>Room #: {roomNumber}</p>
      <p>Check In Date: {checkInDate}</p>
      <p>Check Out Date: {checkOutDate}</p>
      <p>Deposit: ${deposit}</p>
      <p>Total Charge: ${totalCharge}</p>
      <p>Payment Due: ${paymentDue}</p>
    </div>
  );
};

export default TransactionOverviewCard;