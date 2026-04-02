import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }
    @UseGuards(JwtAuthGuard)
    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file', {
        dest: './uploads', // dossier local
    }))
    upload(@Param('id') id: string, @UploadedFile() file: MulterFile) {
        return this.productsService.attachImage(id, file.filename);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query() query: any) {
        return this.productsService.findAll(query);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}