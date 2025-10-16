import { Module } from '@nestjs/common';
import { SocketFish } from "./socketfish";

@Module({
  imports: [SocketFish],
})
export class AppModule { }
