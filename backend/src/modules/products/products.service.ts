import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { barcode: dto.barcode },
    });

    if (existing) {
      throw new BadRequestException('Barcode already exists');
    }

    return this.prisma.product.create({
      data: dto,
    });
  }

 async findAll(query: any) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || '';

  return this.prisma.product.findMany({
    where: {
      name: {
        contains: search,
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
  async attachImage(id: string, filename: string) {
  return this.prisma.product.update({
    where: { id },
    data: {
      image: filename,
    },
  });
}

}