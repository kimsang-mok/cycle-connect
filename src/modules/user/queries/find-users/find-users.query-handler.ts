import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated } from '@src/libs/ddd';
import { PaginatedParams, PaginatedQueryBase } from '@src/libs/ddd/query.base';
import { Ok, Result } from 'oxide.ts';
import { UserModel, userSchema } from '../../database/user.schema';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';

export class FindUsersQuery extends PaginatedQueryBase {
  readonly email?: string;

  constructor(props: PaginatedParams<FindUsersQuery>) {
    super(props);
    this.email = props.email;
  }
}

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler
  implements IQueryHandler<FindUsersQuery, Result<Paginated<UserModel>, Error>>
{
  constructor(
    @InjectPool()
    private readonly pool: DatabasePool,
  ) {}

  async execute(
    query: FindUsersQuery,
  ): Promise<Result<Paginated<UserModel>, Error>> {
    /**
     * Constructing a query with Slonik.
     * More info: https://contra.com/p/AqZWWoUB-writing-composable-sql-using-java-script
     */
    const statement = sql.type(userSchema)`
        SELECT *
        FROM users
        WHERE
            ${query.email ? sql`email = ${query.email}` : true}
        LIMIT ${query.limit}
        OFFSET ${query.offset}`;

    const records = await this.pool.query(statement);

    return Ok(
      new Paginated({
        data: records.rows,
        count: records.rowCount,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
