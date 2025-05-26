import { Command, CommandProps } from '@src/libs/ddd';
import { BikeTypes } from '../../domain/bike.types';
import { Price } from '../../domain/value-objects/price.value-object';

export class CreateBikeCommand extends Command {
  readonly ownerId: string;

  readonly type: BikeTypes;

  readonly model: string;

  readonly enginePower: number;

  readonly pricePerDay: Price;

  readonly description: string;

  constructor(props: CommandProps<CreateBikeCommand>) {
    super(props);
    this.ownerId = props.ownerId;
    this.type = props.type;
    this.model = props.model;
    this.enginePower = props.enginePower;
    this.pricePerDay = props.pricePerDay;
    this.description = props.description;
  }
}
