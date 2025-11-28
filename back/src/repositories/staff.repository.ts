import prisma from '../config/database.config';
import {
  IStaffRepository,
  StaffWithUser,
  CreateStaffData,
  UpdateStaffData,
} from '../types/repository.types';

export class StaffRepository implements IStaffRepository {
  async findAll({ withEmail }: { withEmail: boolean }): Promise<StaffWithUser[]> {
    return prisma.staff.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: withEmail,
            image: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as Promise<StaffWithUser[]>;
  }

  async findById(id: string): Promise<StaffWithUser | null> {
    return prisma.staff.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    }) as Promise<StaffWithUser | null>;
  }

  async findByUserId(userId: string): Promise<StaffWithUser | null> {
    return prisma.staff.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    }) as Promise<StaffWithUser | null>;
  }

  async create(data: CreateStaffData): Promise<StaffWithUser> {
    return prisma.staff.create({
      data: {
        userId: data.userId,
        role: data.role,
        description: data.description,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    }) as Promise<StaffWithUser>;
  }

  async update(id: string, data: UpdateStaffData): Promise<StaffWithUser> {
    return prisma.staff.update({
      where: { id },
      data: {
        role: data.role,
        description: data.description,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    }) as Promise<StaffWithUser>;
  }

  async delete(id: string): Promise<void> {
    await prisma.staff.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.staff.count();
  }
}

export const staffRepository = new StaffRepository();
