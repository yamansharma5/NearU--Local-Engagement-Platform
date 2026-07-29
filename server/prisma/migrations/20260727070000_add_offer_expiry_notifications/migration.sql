CREATE TYPE "NotificationType" AS ENUM ('OFFER_EXPIRED');

ALTER TABLE "Post" ADD COLUMN "expiredAt" TIMESTAMP(3);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "postId" TEXT,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Notification_postId_type_key" ON "Notification"("postId", "type");
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
CREATE INDEX "Post_validUntil_idx" ON "Post"("validUntil");

ALTER TABLE "Notification"
  ADD CONSTRAINT "Notification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Notification"
  ADD CONSTRAINT "Notification_postId_fkey"
  FOREIGN KEY ("postId") REFERENCES "Post"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
