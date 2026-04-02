import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async create(action: string, entity: string, entityId: string, userId?: string) {
    return this.prisma.log.create({
      data: { action, entity, entityId, userId },
    });
  }
}