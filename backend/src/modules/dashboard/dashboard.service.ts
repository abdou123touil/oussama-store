import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // 🔥 GLOBAL STATS
  async getStats() {
    const totalRevenue = await this.prisma.sale.aggregate({
      _sum: { total: true },
    });

    const totalProfit = await this.prisma.sale.aggregate({
      _sum: { profit: true },
    });

    const totalSales = await this.prisma.sale.count();

    return {
      revenue: totalRevenue._sum.total || 0,
      profit: totalProfit._sum.profit || 0,
      sales: totalSales,
    };
  }

  // 🔥 TOP PRODUCTS
  async getTopProducts() {
    const items = await this.prisma.salesItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    return Promise.all(
      items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        return {
          name: product?.name,
          quantity: item._sum.quantity,
        };
      }),
    );
  }

  // 🔥 LOW STOCK
  async getLowStock() {
    return this.prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
      },
      orderBy: {
        stock: 'asc',
      },
    });
  }
}