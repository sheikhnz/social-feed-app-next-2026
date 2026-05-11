-- Accelerates feed queries that filter by author + visibility + newest-first order.
CREATE INDEX "posts_authorId_visibility_createdAt_idx" ON "posts"("authorId", "visibility", "createdAt" DESC);

-- Supports ORDER BY createdAt DESC on likes for a given polymorphic target (recent likers, timelines).
CREATE INDEX "likes_targetType_targetId_createdAt_idx" ON "likes"("targetType", "targetId", "createdAt" DESC);
