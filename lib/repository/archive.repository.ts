import { AvailabilityStatus } from "@prisma/client";
import { Archive, ArchiveProps } from "../types/archive.type";
import { DbConnection } from "../util/db-connection.util";
import { BaseRepository } from "./base.repository";
import { IPaginator } from "../interfaces/paginator";

export class ArchiveRepository extends BaseRepository<Archive, ArchiveProps, number>
  implements IPaginator<Archive> {
  protected selectedProps(): ArchiveProps {
    return {
      id: true,
      fileName: true,
      path: true,
      createdAt: true,
      department: true,
      documentType: true
    }
  }

  async create(entity: Archive): Promise<Archive> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const addedDocument = await prisma.archive.create({
      data: {
        fileName: entity.fileName,
        path: entity.path,
        documentType: entity.documentType,
        createdAt: entity.createdAt,
        departmentId: entity.departmentId!,
      },
      select: this.selectedProps()
    });

    await db.close();

    return addedDocument;
  }


  async update(entity: Archive): Promise<Archive> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const updatedDocument = await prisma.archive.update({
      where: {
        id: entity.id
      },
      data: {
        fileName: entity.fileName,
        path: entity.path,
        documentType: entity.documentType,
        createdAt: entity.createdAt,
        departmentId: entity.departmentId!,
      },
      select: this.selectedProps()
    });

    await db.close();

    return updatedDocument;
  }


  async delete(id: number): Promise<void> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    await prisma.archive.update({
      where: {
        id: id
      },
      data: {
        status: AvailabilityStatus.UN_AVAILABLE
      }
    });

    await db.close();
  }


  async find(id: number): Promise<Archive | null> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const document = await prisma.archive.findFirst({
      where: {
        id: id
      },
      select: this.selectedProps()
    });

    await db.close();

    return document;
  }


  async paginate(value: string, page: number): Promise<Archive[]> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const documents = await prisma.archive.findMany({
      skip: this.rows * page,
      take: this.rows,
      where: {
        status: AvailabilityStatus.AVAILABLE,
        fileName: {
          contains: value,
          mode: "insensitive"
        }
      },
      select: this.selectedProps()
    });

    await db.close();

    return documents;
  }


  async count(value: string): Promise<number> {
    const db = DbConnection.getInstance();
    const prisma = await db.open();

    const rowCount = await prisma.archive.count({
      where: {
        status: AvailabilityStatus.AVAILABLE,
        fileName: {
          contains: value,
          mode: "insensitive"
        }
      }
    });

    await db.close();

    return rowCount;
  }
}