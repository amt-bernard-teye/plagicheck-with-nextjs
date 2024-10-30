import { AvailabilityStatus } from "@prisma/client";
import { Department, DepartmentProps } from "../types/department.type";
import { DbConnection } from "../util/db-connection.util";
import { BaseRepository } from "./base.repository";
import { IMultipleFinder } from "../interfaces/multiple-finder";

export class DepartmentRepository extends BaseRepository<Department, DepartmentProps, number | string>
  implements IMultipleFinder<Department> {
  protected selectedProps(): DepartmentProps {
    return {
      id: true,
      name: true,
      facultyId: true,
    }
  };


  async create(entity: Department): Promise<Department> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const department = await prisma.department.create({
      data: {
        name: entity.name,
        facultyId: entity.facultyId!,
      },
      select: this.selectedProps()
    });

    await db.close();

    return department;
  }


  async update(entity: Department): Promise<Department> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const department = await prisma.department.update({
      where: {
        id: entity.id
      },
      data: {
        name: entity.name,
        facultyId: entity.facultyId,
        status: entity.status
      },
      select: this.selectedProps()
    });

    await db.close();

    return department;
  }


  async delete(id: number): Promise<void> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    await prisma.department.update({
      where: {
        id: id
      },
      data: {
        status: AvailabilityStatus.UN_AVAILABLE
      }
    });

    await db.close();
  }


  async find(value: number | string): Promise<Department | null> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();
    let department: Department | null = null;

    if (typeof value === "number") {
      department = await prisma.department.findFirst({
        where: {
          id: value
        }
      });
    }
    else if (typeof value === "string") {
      department = await prisma.department.findFirst({
        where: {
          name: {
            equals: value,
            mode: "insensitive"
          }
        }
      });
    }

    await db.close();

    return department;
  }


  async findAll(): Promise<Department[]> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const departments = await prisma.department.findMany({
      where: {
        status: AvailabilityStatus.AVAILABLE
      }
    });

    await db.close();

    return departments;
  }
}