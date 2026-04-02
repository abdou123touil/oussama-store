import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async createPurchase(dto: CreatePurchaseDto) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      const itemsData: any[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException('Produit introuvable');
        }

        const itemTotal = item.quantity * item.purchasePrice;
        total += itemTotal;

        itemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
        });

        // 🔥 STOCK INCREMENT + UPDATE PRICE
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
            purchasePrice: item.purchasePrice,
          },
        });
      }

      return tx.purchase.create({
        data: {
          supplierId: dto.supplierId,
          total,
          status: 'COMPLETED',
          date: new Date(),
          reference: `PUR-${Date.now()}`,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });
    });
  }

  async getAllPurchases() {
    return this.prisma.purchase.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getOnePurchase(id: string) {
    return this.prisma.purchase.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
      },
    });
  }
}