import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config"
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ComponentsModule,
    DatabaseModule,
  ],
  providers: [
   AppService
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('✅ Cloudinary configured');
  }
}
