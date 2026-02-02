-- CreateTable
CREATE TABLE "baby_photos" (
    "id" TEXT NOT NULL,
    "baby_id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "baby_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "baby_photos_baby_id_idx" ON "baby_photos"("baby_id");

-- AddForeignKey
ALTER TABLE "baby_photos" ADD CONSTRAINT "baby_photos_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "babies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
