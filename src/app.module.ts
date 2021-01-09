import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig, { databaseurl } from './config/app.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Adn, AdnSchema } from './entites/adn.entites';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], // 👈
    }),
    MongooseModule.forRoot(databaseurl()),
    MongooseModule.forFeature([{ name: Adn.name, schema: AdnSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
