import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class SalesService {
    constructor(private prisma: PrismaService) { }

    async createSale(dto: CreateSaleDto, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            let total = 0;
            let profit = 0;

            const itemsData: any[] = [];

            for (const item of dto.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new BadRequestException('Produit introuvable');
                }

                if (product.stock < item.quantity) {
                    throw new BadRequestException(
                        `Stock insuffisant pour ${product.name}`,
                    );
                }

                const itemTotal = item.quantity * item.sellingPrice;
                const itemProfit =
                    (item.sellingPrice - product.purchasePrice) *
                    item.quantity;

                total += itemTotal;
                profit += itemProfit;

                itemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    sellingPrice: item.sellingPrice,
                });

                // 🔥 update stock sécurisé
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            const sale = await tx.sale.create({
                data: {
                    total,
                    profit,
                    userId,
                    date: new Date(),
                    items: {
                        create: itemsData,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            return sale;
        });
    }
    async generateInvoice(res, sale) {
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Invoice', { align: 'center' });

        doc.text(`Sale ID: ${sale.id}`);
        doc.text(`Total: ${sale.total}`);
        doc.text(`Profit: ${sale.profit}`);

        doc.moveDown();

        sale.items.forEach(item => {
            doc.text(`${item.product.name} x ${item.quantity}`);
        });

        doc.end();
    }
    async getAllSales() {
        return this.prisma.sale.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getOneSale(id: string) {
        return this.prisma.sale.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
    }
}