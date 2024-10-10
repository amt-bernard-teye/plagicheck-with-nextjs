import { AvailabilityStatus } from "@prisma/client";
import { Faculty, FacultyProp } from "../types/faculty.type";
import { DbConnection } from "../util/db-connection.util";
import { BaseRepository } from "./base.repository";
import { IPaginator } from "../interfaces/paginator";
import { IMultipleFinder } from "../interfaces/multiple-finder";

export class FacultyRepository extends BaseRepository<Faculty, FacultyProp, number | string>
  implements IMultipleFinder<Faculty>, IPaginator<Faculty> {
  protected selectedProps(): FacultyProp {
    return {
      id: true,
      name: true,
      departments: true
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

  
  async paginate(value: string, page: number): Promise<Faculty[]> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const faculties = await prisma.faculty.findMany({
      take: this.rows,
      skip: page * this.rows,
      orderBy: {
        id: "desc"
      },
      where: {
        status: AvailabilityStatus.AVAILABLE,
        name: {
          contains: value,
          mode: "insensitive"
        }
      },
      select: {
        ...this.selectedProps(),
        departments: {
          where: {
            status: AvailabilityStatus.AVAILABLE
          }
        }
      }
    });

    await db.close();

    return faculties;
  }


  async count(value: string = ""): Promise<number> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const totalRows = await prisma.faculty.count({
      where: {
        status: AvailabilityStatus.AVAILABLE,
        name: {
          contains: value,
          mode: "insensitive"
        }
      }
    });

    await db.close();

    return totalRows;
  }


  async findAll(): Promise<Faculty[]> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const faculties = await prisma.faculty.findMany({
      orderBy: {
        id: "desc"
      },
      where: {
        status: AvailabilityStatus.AVAILABLE,
      },
      select: this.selectedProps()
    });

    await db.close();

    return faculties;
  }
}