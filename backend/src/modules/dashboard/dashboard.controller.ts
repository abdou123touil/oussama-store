import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('top-products')
  getTopProducts() {
    return this.dashboardService.getTopProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('low-stock')
  getLowStock() {
    return this.dashboardService.getLowStock();
  }
}