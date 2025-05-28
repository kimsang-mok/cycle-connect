import { Injectable } from '@nestjs/common';
import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';
import { RentalPeriod } from '@src/modules/bike/domain/value-objects/rental-period.value-object';

@Injectable()
export class BookingPricingServie {
  calculateTotalPrice(
    basePricePerDay: Price,
    rentalPeriod: RentalPeriod,
    discountPercent: number = 0,
  ) {
    const base = basePricePerDay.multiply(rentalPeriod.getDurationInDays());

    if (discountPercent <= 0) return base;

    return base.applyDiscount(discountPercent);
  }
}
