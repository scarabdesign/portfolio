import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post()
  // doPost(@Req() req: Request) {
  //   return req.body;
  // }

  // @Get("/key/:key")
  // getKey(@Param() params: { key: string }): object {
  //   return this.appService.getKey(params);
  // }

}
