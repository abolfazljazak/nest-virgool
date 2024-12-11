import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function SwaggerConfigInit(app: INestApplication) {
    const document = new DocumentBuilder()
    .setTitle("virgool")
    .setDescription("backEnd of virgool website")
    .setVersion("v0.0.1")
    .build()

    const swaggerDocument = SwaggerModule.createDocument(app, document)
    SwaggerModule.setup("/swagger", app, swaggerDocument)
}