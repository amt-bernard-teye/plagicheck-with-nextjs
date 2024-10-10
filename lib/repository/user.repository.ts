import { AvailabilityStatus, PrismaClient, Role } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { User, UserProp } from "../types/user.type";
import { DbConnection } from "../util/db-connection.util";

export class UserRepository extends BaseRepository<User, UserProp, string> {
  protected selectedProps(): UserProp {
    return {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      phoneNumber: true,
      status: true
    };
  }

  
  async create(entity: User): Promise<User> {
    const dbInstance = DbConnection.getInstance();
    const connection = await dbInstance.open();

    const nextId = await this.getNextId(entity.role, connection);
    const user = await connection.user.create({
      data: {
        id: nextId,
        name: entity.name,
        email: entity.email,
        password: entity.password!,
        phoneNumber: entity.phoneNumber,
        role: entity.role,
      },
      select: this.selectedProps()
    });

    await dbInstance.close();

    return user;
  }

  private async getNextId(preferredRole: Role, connection: PrismaClient) {
    const totalRows = await connection.user.count({
      where: {
        role: preferredRole
      }
    });

    let initial = "";
    switch(preferredRole) {
      case Role.ADMIN:
        initial = "AD";
        break;
      case Role.LECTURER:
        initial = "LT";
        break;
      case Role.STUDENT:
        initial = "ST";
        break;
    }

    let start = 1000;
    return initial + (start + totalRows + 1);
  }


  async update(entity: User): Promise<User> {
    const dbInstance = DbConnection.getInstance();
    const connection = await dbInstance.open();

    const user = await connection.user.update({
      where: {
        id: entity.id
      },
      data: {
        name: entity.name,
        email: entity.email,
        password: entity.password!,
        phoneNumber: entity.phoneNumber,
        role: entity.role,
      },
      select: this.selectedProps()
    });

    await dbInstance.close();
    return user;
  }


  async delete(id: string): Promise<void> {
    const dbInstance = DbConnection.getInstance();
    const connection = await dbInstance.open();

    await connection.user.update({
      where: {
        id: id
      },
      data: {
        status: AvailabilityStatus.UN_AVAILABLE
      },
      select: this.selectedProps()
    });

    await dbInstance.close();
  }


  async find(value: string): Promise<User | null> {
    const dbInstance = DbConnection.getInstance();
    const connection = await dbInstance.open();

    const user = await connection.user.findFirst({
      where: {
        OR: [
          {id: value},
          {email: value}
        ]
      }
    });

    await dbInstance.close();

    return user;
  }
}