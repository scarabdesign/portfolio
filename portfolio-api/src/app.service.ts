import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Dude!';
  }
  // getUmm(): object {
  //   return {
  //     "status": "ok"
  //   }
  // }
  // getKey(params: object): object {
  //   return params;
  // }
}
