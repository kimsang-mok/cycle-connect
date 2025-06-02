import { PaginatedParams, PaginatedQueryBase } from '@src/libs/ddd/query.base';
import { BikeTypes } from '../../domain/bike.types';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { Paginated } from '@src/libs/ddd';
import { BikeModel, bikeSchema } from '../../database/bike.schema';

export class FindBikesQuery extends PaginatedQueryBase {
  readonly type?: BikeTypes;

  readonly model?: string;

  readonly enginePower?: number;

  readonly minPrice?: number;

  readonly maxPrice?: number;

  readonly ownerId?: string;

  constructor(props: PaginatedParams<FindBikesQuery>) {
    super(props);
    this.type = props.type;
    this.model = props.model;
    this.enginePower = props.enginePower;
    this.minPrice = props.minPrice;
    this.maxPrice = props.maxPrice;
    this.ownerId = props.ownerId;
  }
}

@QueryHandler(FindBikesQuery)
export class FindBikesQueryHandler implements IQueryHandler<FindBikesQuery> {
  constructor(
    @InjectPool()
    private readonly pool: DatabasePool,
  ) {}

  async execute(query: FindBikesQuery): Promise<Paginated<BikeModel>> {
    const conditions = [
      query.type ? sql`type = ${query.type}` : sql`TRUE`,
      query.model ? sql`model ILIKE ${'%' + query.model + '%'}` : sql`TRUE`,
      query.enginePower ? sql`"enginePower" = ${query.enginePower}` : sql`TRUE`,
      query.minPrice ? sql`"pricePerDay" >= ${query.minPrice}` : sql`TRUE`,
      query.maxPrice ? sql`"pricePerDay" <= ${query.maxPrice}` : sql`TRUE`,
      query.ownerId ? sql`"ownerId" = ${query.ownerId}` : sql`TRUE`,
    ];

    const statement = sql.type(bikeSchema)`
        SELECT * 
        FROM bikes
        WHERE ${sql.join(conditions, sql` AND `)}
        LIMIT ${query.limit}
        OFFSET ${query.offset}
    `;

    const result = await this.pool.query(statement);

    return new Paginated({
      data: result.rows,
      count: result.rowCount,
      limit: query.limit,
      page: query.page,
    });
  }
}
