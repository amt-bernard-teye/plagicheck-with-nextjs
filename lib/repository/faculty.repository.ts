import { AvailabilityStatus } from "@prisma/client";
import { Faculty, FacultyProp } from "../types/faculty.type";
import { DbConnection } from "../utils/db-connection.util";
import { BaseRepository } from "./base.repository";

export class FacultyRepository extends BaseRepository<Faculty, FacultyProp, number | string> {
  protected selectedProps(): FacultyProp {
    return {
      id: true,
      name: true,
    }
  }


  async create(entity: Faculty): Promise<Faculty> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();    

    const faculty = await prisma.faculty.create({
      data: {
        name: entity.name,
      },
      select: this.selectedProps()
    });

    await db.close();

    return faculty;
  }


  async update(entity: Faculty): Promise<Faculty> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const faculty = await prisma.faculty.update({
      where: {
        id: entity.id
      },
      data: {
        name: entity.name,
        status: entity.status
      },
      select: this.selectedProps()
    });

    await db.close();

    return faculty;
  }


  async delete(id: number): Promise<void> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    await prisma.faculty.update({
      where: {
        id: id
      },
      data: {
        status: AvailabilityStatus.UN_AVAILABLE
      }
    });

    await db.close();
  }


  async find(value: number | string): Promise<Faculty | null> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();
    let faculty: Faculty | null = null;

    if (typeof value === "string") {
      faculty = await prisma.faculty.findFirst({
        where: {
          name: value
        }
      });
    } else {
      faculty = await prisma.faculty.findFirst({
        where: {
          id: value
        }
      });
    }

    await db.close();

    return faculty;
  }
}