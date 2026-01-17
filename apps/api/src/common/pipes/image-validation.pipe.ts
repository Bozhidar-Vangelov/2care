import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const maxFileSize =
      this.configService.get<number>('supabase.storage.maxFileSize') ||
      1024 * 1024;
    const allowedMimeTypes =
      this.configService.get<string[]>('supabase.storage.allowedMimeTypes') ||
      [];

    if (file.size > maxFileSize) {
      throw new BadRequestException(
        `File size exceeds limit of ${maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Validate file type
    if (!allowedMimeTypes.includes(file.mimetype ?? '')) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    return file;
  }
}
