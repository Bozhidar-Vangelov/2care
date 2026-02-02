import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly supabase: SupabaseClient;
  private readonly avatarsBucket: string;
  private readonly babyPhotosBucket: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseKey = this.configService.get<string>(
      'supabase.serviceRoleKey',
    );

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClient;
    this.avatarsBucket =
      this.configService.get<string>('supabase.storage.avatarsBucket') ||
      'avatars';
    this.babyPhotosBucket =
      this.configService.get<string>('supabase.storage.babyPhotosBucket') ||
      'baby-photos';
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    // Compress and optimize the image
    const compressedBuffer = await this.compressImage(file.buffer);

    const fileName = `${userId}-${Date.now()}.webp`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from(this.avatarsBucket)
      .upload(filePath, compressedBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      this.logger.error(`Failed to upload avatar: ${uploadError.message}`);
      throw new Error('Failed to upload avatar');
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.avatarsBucket).getPublicUrl(filePath);

    return publicUrl;
  }

  private async compressImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center',
      })
      .webp({
        quality: 80,
        effort: 6,
      })
      .toBuffer();
  }

  async deleteAvatar(avatarUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(avatarUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts
        .slice(pathParts.indexOf(this.avatarsBucket) + 1)
        .join('/');

      const { error } = await this.supabase.storage
        .from(this.avatarsBucket)
        .remove([filePath]);

      if (error) {
        this.logger.warn(`Failed to delete old avatar: ${error.message}`);
      }
    } catch {
      this.logger.warn(`Failed to parse avatar URL: ${avatarUrl}`);
    }
  }

  async uploadBabyPhoto(
    babyId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    // Compress and optimize the image
    const compressedBuffer = await this.compressImage(file.buffer);

    const fileName = `${babyId}-${Date.now()}.webp`;
    const filePath = `photos/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from(this.babyPhotosBucket)
      .upload(filePath, compressedBuffer, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (uploadError) {
      this.logger.error(`Failed to upload baby photo: ${uploadError.message}`);
      throw new Error('Failed to upload baby photo');
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage
      .from(this.babyPhotosBucket)
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async deleteBabyPhoto(photoUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(photoUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts
        .slice(pathParts.indexOf(this.babyPhotosBucket) + 1)
        .join('/');

      const { error } = await this.supabase.storage
        .from(this.babyPhotosBucket)
        .remove([filePath]);

      if (error) {
        this.logger.warn(`Failed to delete baby photo: ${error.message}`);
      }
    } catch {
      this.logger.warn(`Failed to parse baby photo URL: ${photoUrl}`);
    }
  }
}
