import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api/response.base';
import { BookingStatus } from '../domain/booking.types';

export class BookingResponseDto extends ResponseBase {
  @ApiProperty({
    description: 'ID of the bike being booked',
    example: 'aa7d3a48-3fc9-4ac6-bd80-4ebf8ebcae22',
  })
  bikeId: string;

  @ApiProperty({
    description: 'ID of the customer who made the booking',
    example: 'e0e23ab5-7d3c-4de3-8480-c826c3b35f71',
  })
  customerId: string;

  @ApiProperty({
    description: 'Start date of the rental period',
    example: '2025-06-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the rental period',
    example: '2025-06-03T00:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Total price for the rental period',
    example: 45.0,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Current status of the booking',
    enum: BookingStatus,
    example: BookingStatus.pendingPayment,
  })
  status: BookingStatus;
}
