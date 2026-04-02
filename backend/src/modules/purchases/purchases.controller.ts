import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('purchases')
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePurchaseDto) {
    return this.purchasesService.createPurchase(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.purchasesService.getAllPurchases();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.getOnePurchase(id);
  }
}