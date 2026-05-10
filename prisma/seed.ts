/**
 * Seed script — populates the database with realistic demo data.
 * Run via: pnpm db:seed  (or `prisma migrate dev --name init` which also seeds)
 *
 * Strategy: upsert everything so re-running is idempotent.
 */
import bcrypt from "bcrypt";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const SALT_ROUNDS = 12;

const USERS = [
  {
    email: "alice@example.com",
    password: "alicepassword123",
    firstName: "Alice",
    lastName: "Nguyen",
    image: "https://i.pravatar.cc/150?u=alice",
  },
  {
    email: "bob@example.com",
    password: "bobpassword123",
    firstName: "Bob",
    lastName: "Martinez",
    image: "https://i.pravatar.cc/150?u=bob",
  },
  {
    email: "carol@example.com",
    password: "carolpassword123",
    firstName: "Carol",
    lastName: "Kim",
    image: "https://i.pravatar.cc/150?u=carol",
  },
  {
    email: "dev@example.com",
    password: "devpassword123",
    firstName: "Dev",
    lastName: "User",
    image: null,
  },
] as const;

// Post content keyed to author email
const POSTS: {
  authorEmail: string;
  content: string;
  imageUrl?: string;
  visibility: "PUBLIC" | "PRIVATE";
}[] = [
  {
    authorEmail: "alice@example.com",
    content:
      "Just shipped a brand-new feature to production 🚀 — zero downtime, all green. Hard work pays off!",
    imageUrl: "https://picsum.photos/seed/post1/800/450",
    visibility: "PUBLIC",
  },
  {
    authorEmail: "alice@example.com",
    content:
      "Reading 'Designing Data-Intensive Applications' for the third time. Each pass reveals something new. Highly recommend for any engineer building at scale.",
    visibility: "PUBLIC",
  },
  {
    authorEmail: "bob@example.com",
    content:
      "Morning coffee + open-source contributions = the perfect Saturday ☕ Who else spends weekends hacking on side projects?",
    imageUrl: "https://picsum.photos/seed/post2/800/450",
    visibility: "PUBLIC",
  },
  {
    authorEmail: "bob@example.com",
    content:
      "Private note to self: remember to rotate the API keys before the quarterly review.",
    visibility: "PRIVATE",
  },
  {
    authorEmail: "carol@example.com",
    content:
      "Finished my first 5K run today! 🏃‍♀️ 28 minutes flat. Six months ago I could barely manage 1K. Progress is everything.",
    imageUrl: "https://picsum.photos/seed/post3/800/450",
    visibility: "PUBLIC",
  },
  {
    authorEmail: "carol@example.com",
    content:
      "Tried making ramen from scratch — stock took 6 hours but the result was absolutely worth it 🍜",
    visibility: "PUBLIC",
  },
  {
    authorEmail: "dev@example.com",
    content:
      "This is the dev seed account. Use it for local testing. Email: dev@example.com | Pass: devpassword123",
    visibility: "PUBLIC",
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const main = async (): Promise<void> => {
  const { prisma } = await import("../src/lib/prisma");

  try {
    console.log("🌱 Seeding database…");

    // 1. Upsert users
    const createdUsers: Record<string, { id: string }> = {};

    for (const u of USERS) {
      const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
      const user = await prisma.user.upsert({
        where: { email: u.email },
        create: {
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          passwordHash: hash,
          image: u.image ?? null,
        },
        update: {
          firstName: u.firstName,
          lastName: u.lastName,
          passwordHash: hash,
          image: u.image ?? null,
        },
        select: { id: true },
      });
      createdUsers[u.email] = user;
      console.log(`  ✅ User: ${u.email}`);
    }

    // 2. Upsert posts (use content prefix as natural key for idempotency)
    const createdPosts: { id: string }[] = [];

    for (const p of POSTS) {
      const authorId = createdUsers[p.authorEmail]!.id;
      // Find an existing post by author + first 60 chars of content
      const existing = await prisma.post.findFirst({
        where: {
          authorId,
          content: { startsWith: p.content.slice(0, 60) },
        },
        select: { id: true },
      });

      const post = existing
        ? await prisma.post.update({
            where: { id: existing.id },
            data: {
              content: p.content,
              imageUrl: p.imageUrl ?? null,
              visibility: p.visibility,
            },
            select: { id: true },
          })
        : await prisma.post.create({
            data: {
              authorId,
              content: p.content,
              imageUrl: p.imageUrl ?? null,
              visibility: p.visibility,
            },
            select: { id: true },
          });

      createdPosts.push(post);
    }
    console.log(`  ✅ Posts: ${createdPosts.length} seeded`);

    // 3. Seed comments on the first public post (Alice's first post)
    const targetPost = createdPosts[0]!;
    const [alice, bob, carol] = [
      createdUsers["alice@example.com"]!,
      createdUsers["bob@example.com"]!,
      createdUsers["carol@example.com"]!,
    ];

    // Top-level comments
    const c1 = await prisma.comment.create({
      data: {
        postId: targetPost.id,
        authorId: bob.id,
        content: "Congrats! What stack are you running in prod?",
      },
      select: { id: true },
    });

    const c2 = await prisma.comment.create({
      data: {
        postId: targetPost.id,
        authorId: carol.id,
        content: "Zero downtime deploys are an art. Well done! 🎉",
      },
      select: { id: true },
    });

    // Replies (parentCommentId set)
    await prisma.comment.createMany({
      data: [
        {
          postId: targetPost.id,
          authorId: alice.id,
          parentCommentId: c1.id,
          content: "Next.js 16 + Postgres on Supabase. Loving the DX so far!",
        },
        {
          postId: targetPost.id,
          authorId: bob.id,
          parentCommentId: c1.id,
          content: "Nice! Have you tried the new Prisma 7 driver adapters?",
        },
        {
          postId: targetPost.id,
          authorId: alice.id,
          parentCommentId: c2.id,
          content: "Thanks Carol! Blue-green + feature flags made it painless.",
        },
      ],
    });

    console.log(`  ✅ Comments: 5 seeded (2 top-level, 3 replies)`);

    // 4. Seed likes on posts
    const publicPosts = createdPosts.filter((_, i) => POSTS[i]?.visibility === "PUBLIC");

    await prisma.like.createMany({
      skipDuplicates: true,
      data: [
        // Alice's first post liked by bob and carol
        { userId: bob.id, targetType: "POST", targetId: publicPosts[0]!.id },
        { userId: carol.id, targetType: "POST", targetId: publicPosts[0]!.id },
        // Bob's post liked by alice
        { userId: alice.id, targetType: "POST", targetId: publicPosts[2]!.id },
        // Carol's first post liked by alice and bob
        { userId: alice.id, targetType: "POST", targetId: publicPosts[4]!.id },
        { userId: bob.id, targetType: "POST", targetId: publicPosts[4]!.id },
        // Like on a comment
        { userId: carol.id, targetType: "COMMENT", targetId: c1.id },
        { userId: alice.id, targetType: "COMMENT", targetId: c2.id },
      ],
    });

    console.log(`  ✅ Likes: seeded`);
    console.log("\n🎉 Seed complete!\n");
    console.log("Demo accounts:");
    for (const u of USERS) {
      console.log(`  ${u.email} / ${u.password}`);
    }
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
