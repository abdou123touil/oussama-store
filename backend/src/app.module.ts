import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserService } from './modules/users/user.service';
import { UserModule } from './modules/users/user.module';
import { SalesService } from './modules/sales/sales.service';
import { SalesModule } from './modules/sales/sales.module';
import { PurchasesService } from './modules/purchases/purchases.service';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { SuppliersService } from './modules/suppliers/suppliers.service';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { CommonService } from './common/common.service';
import { PrismaService } from './prisma/prisma.service';
import { DashboardService } from './modules/dashboard/dashboard.service';
import { DashboardController } from './modules/dashboard/dashboard.controller';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [ProductsModule, AuthModule, UserModule, SalesModule, PurchasesModule, SuppliersModule, DashboardModule],
  controllers: [AppController, DashboardController],
  providers: [AppService, DashboardService],
})
export class AppModule {}
