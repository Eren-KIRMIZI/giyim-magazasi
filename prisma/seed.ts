import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { products, collections } from "../lib/data";

async function main() {
  const categories = Array.from(new Set(products.map((p) => p.category)));

  for (const slug of categories) {
    const label = products.find((p) => p.category === slug)!.categoryLabel;
    await prisma.category.upsert({
      where: { slug },
      update: { name: label },
      create: { slug, name: label },
    });
  }

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        status: p.badge === "SOLD OUT" ? "SOLD_OUT" : "ACTIVE",
        badge: p.badge ?? null,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: 25,
        status: p.badge === "SOLD OUT" ? "SOLD_OUT" : "ACTIVE",
        badge: p.badge ?? null,
        category: { connect: { slug: p.category } },
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productVariant.deleteMany({ where: { productId: product.id } });

    await prisma.productImage.createMany({
      data: p.images.map((img, i) => ({
        productId: product.id,
        url: img.src,
        alt: img.alt,
        position: i,
      })),
    });

    const soldOut = new Set(p.soldOutSizes ?? []);
    const skuSeen = new Set<string>();
    await prisma.productVariant.createMany({
      data: p.sizes.flatMap((size) => {
        const colors = p.colors?.length ? p.colors : [{ name: "Black" }];
        return colors.map((c) => {
          let sku = `${p.slug}-${size}-${c.name.toLowerCase()}`;
          let n = 2;
          while (skuSeen.has(sku)) sku = `${p.slug}-${size}-${c.name.toLowerCase()}-${n++}`;
          skuSeen.add(sku);
          return {
            productId: product.id,
            size,
            color: c.name,
            sku,
            stock: soldOut.has(size) ? 0 : 25,
          };
        });
      }),
    });
  }

  const demoEmail = process.env.DEMO_USER_EMAIL ?? "demo@lastdance.store";
  const demoPassword = process.env.DEMO_USER_PASSWORD ?? "demo1234";
  const existing = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email: demoEmail,
        name: "Demo User",
        passwordHash: await bcrypt.hash(demoPassword, 12),
        role: "ADMIN",
      },
    });
    console.log(`Created demo user: ${demoEmail}`);
  }

  console.log(
    `Seeded: ${categories.length} categories, ${products.length} products, ${collections.length} collections (static).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
