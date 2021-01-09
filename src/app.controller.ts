import { Response, Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/mutant/')
  async isMutant(@Body() body, @Response() response) {
    const isMutant = await this.appService.isMutant(body.dna);
    if (isMutant) {
      return response.status(200).json({});
    }
    return response.status(403).json({});
  }
  @Get('/stats')
  async stats() {
    return await this.appService.statsMutant();
  }
}
