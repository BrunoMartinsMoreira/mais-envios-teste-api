import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HangTagsModule } from './modules/hang-tags/hang-tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
    }),
    HangTagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
