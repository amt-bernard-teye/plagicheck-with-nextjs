import { DbConnection } from "../util/db-connection.util";
import { BaseRepository } from "./base.repository";
import { UserRepository } from "./user.repository";
import { Student, StudentProp } from "../types/student.type";
import { IPaginator } from "../interfaces/paginator";
import { AvailabilityStatus, Role } from "@prisma/client";

export class StudentRepository extends BaseRepository<Student, StudentProp, number | string>
  implements IPaginator<Student> {
  protected selectedProps(): StudentProp {
    return {
      user: true,
      department: true,
    }
  }

  
  async create(entity: Student): Promise<Student> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const userRepo = new UserRepository();
    const user = await userRepo.create(entity.user);

    const student = await prisma.student.create({
      data: {
        departmentId: entity.department.id!,
        userId: user.id!,
      },
      select: {
        ...this.selectedProps(),
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phoneNumber: true,
            role: true
          }
        }
      }
    });

    await db.close();

    return student;
  }


  async update(entity: Student): Promise<Student> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const userRepo = new UserRepository();
    const updatedUser = await userRepo.update(entity.user);
    const existingStudent = await this.findByUserId(updatedUser.id!);

    const updatedLecturer = await prisma.student.update({
      where: {
        id: existingStudent?.id
      },
      data: {
        departmentId: entity.department.id,
      },
      select: {
        ...this.selectedProps(),
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phoneNumber: true,
            role: true
          }
        }
      }
    });

    await db.close();
    return updatedLecturer;
  }


  async delete(id: string): Promise<void> {
    const userRepo = new UserRepository();
    const user = await userRepo.find(id);

    if (user === null) {
      return;
    }

    await userRepo.delete(user.id!);
  }


  async find(id: string): Promise<Student | null> {
    const userRepo = new UserRepository();
    const user = await userRepo.find(id);

    if (!user) {
      return null;
    }

    const student = await this.findByUserId(user.id!);

    if (!student) {
      return null;
    }

    return {
      department: student.department,
      user: student.user
    };
  }

  public async findByUserId(userId: string) {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const student = await prisma.student.findFirst({
      where: {
        userId: userId
      },
      select: {
        id: true,
        department: {
          select: {
            id: true,
            name: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            image: true,
            role: true,
            status: true
          }
        }
      }
    });

    await db.close();

    return student;
  }


  async paginate(value: string, page: number): Promise<Student[]> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const students = await prisma.student.findMany({
      skip: this.rows * page,
      take: this.rows,
      orderBy: {
        id: "desc"
      },
      where: {
        user: {
          status: AvailabilityStatus.AVAILABLE,
          OR: [
            {
              name: {
                contains: value,
                mode: "insensitive"
              },
            },
            {
              email: {
                contains: value,
                mode: "insensitive"
              },
            },
            {
              id: {
                contains: value,
                mode: "insensitive"
              },
            }
          ]
        },
      },
      select: {
        department: {
          select: {
            id: true,
            name: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            image: true,
            role: true,
            status: true
          }
        }
      }
    });

    await db.close();
    return students;
  }


  async count(value: string): Promise<number> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const rows = await prisma.user.count({
      where: {
        status: AvailabilityStatus.AVAILABLE,
        role: Role.STUDENT,
        OR: [
          {
            name: {
              contains: value,
              mode: "insensitive"
            },
          },
          {
            email: {
              contains: value,
              mode: "insensitive"
            },
          },
          {
            id: {
              contains: value,
              mode: "insensitive"
            },
          }
        ]
      }
    });

    await db.close();

    return rows;
  }
}