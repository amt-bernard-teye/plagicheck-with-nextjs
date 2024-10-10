import { DbConnection } from "../util/db-connection.util";
import { BaseRepository } from "./base.repository";
import { UserRepository } from "./user.repository";
import { Lecturer, LecturerProp } from "../types/lecturer.type";
import { IPaginator } from "../interfaces/paginator";
import { AvailabilityStatus, Role } from "@prisma/client";

export class LecturerRepository extends BaseRepository<Lecturer, LecturerProp, number | string>
  implements IPaginator<Lecturer> {
  protected selectedProps(): LecturerProp {
    return {
      user: true,
      department: true,
      qualification: true
    }
  }

  
  async create(entity: Lecturer): Promise<Lecturer> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const userRepo = new UserRepository();
    const user = await userRepo.create(entity.user);

    const lecturer = await prisma.lecturer.create({
      data: {
        qualification: entity.qualification,
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

    return lecturer;
  }


  async update(entity: Lecturer): Promise<Lecturer> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const userRepo = new UserRepository();
    const updatedUser = await userRepo.update(entity.user);
    const existingLecturer = await this.findByUserId(updatedUser.id!);

    const updatedLecturer = await prisma.lecturer.update({
      where: {
        id: existingLecturer?.id
      },
      data: {
        departmentId: entity.department.id,
        qualification: entity.qualification
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


  async find(id: string): Promise<Lecturer | null> {
    const userRepo = new UserRepository();
    const user = await userRepo.find(id);

    if (!user) {
      return null;
    }

    const lecturer = await this.findByUserId(user.id!);

    if (!lecturer) {
      return null;
    }

    return {
      department: lecturer.department,
      qualification: lecturer.qualification,
      user: lecturer.user
    };
  }

  public async findByUserId(userId: string) {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const lecturer = await prisma.lecturer.findFirst({
      where: {
        userId: userId
      },
      select: {
        id: true,
        qualification: true,
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

    return lecturer;
  }


  async paginate(value: string, page: number): Promise<Lecturer[]> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const lecturers = await prisma.lecturer.findMany({
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
        }
      },
      select: {
        qualification: true,
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
    return lecturers;
  }


  async count(value: string): Promise<number> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const rows = await prisma.user.count({
      where: {
        status: AvailabilityStatus.AVAILABLE,
        role: Role.LECTURER,
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