import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    Param,
    Res,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
    constructor(private salesService: SalesService) { }

    // 🔥 CREATE SALE
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateSaleDto, @Req() req) {
        return this.salesService.createSale(dto, req.user.userId);
    }

    // 🔥 GET ALL
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.salesService.getAllSales();
    }

    // 🔥 GET ONE
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesService.getOneSale(id);
    }
    @Get(':id/invoice')
    async invoice(@Param('id') id: string, @Res() res) {
        const sale = await this.salesService.getOneSale(id);
        return this.salesService.generateInvoice(res, sale);
    }
}