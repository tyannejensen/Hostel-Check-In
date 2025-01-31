import React from 'react';

const Reservations: React.FC = () => {
  const reservations = [
    {
      firstName: 'John',
      lastName: 'Doe',
      roomNumber: '101',
      checkInDate: '2023-10-01',
      checkOutDate: '2023-10-05',
      payStatus: 'Paid'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      roomNumber: '102',
      checkInDate: '2023-10-02',
      checkOutDate: '2023-10-06',
      payStatus: 'Pending'
    }
    // Add more reservations as needed
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Room #</th>
          <th>Check In Date</th>
          <th>Check Out Date</th>
          <th>Pay Status</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation, index) => (
          <tr key={index}>
            <td>{reservation.firstName}</td>
            <td>{reservation.lastName}</td>
            <td>{reservation.roomNumber}</td>
            <td>{reservation.checkInDate}</td>
            <td>{reservation.checkOutDate}</td>
            <td>{reservation.payStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Reservations;