import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "The Art of Matcha: From Ceremony to Cup",
    slug: "art-of-matcha-ceremony-to-cup",
    excerpt: "Discover the centuries-old Japanese tradition of matcha, from shaded tea fields to the meditative whisking ceremony that creates the perfect bowl.",
    content: `Matcha is more than just a drink — it's a ritual, a meditation, and an art form that has been perfected over 800 years.

The Journey Begins in the Shade

Three weeks before harvest, matcha tea plants are covered with bamboo mats or tarps to block direct sunlight. This shade-growing process forces the leaves to produce more chlorophyll, giving matcha its vibrant emerald color and rich, umami flavor profile. The increased theanine content also creates matcha's signature calming yet focused energy — what Zen monks call "alert calm."

The Tencha Process

After harvesting, the leaves are steamed to halt oxidation, then air-dried without rolling. This unique processing creates tencha — the precursor to matcha. The stems and veins are carefully removed, leaving only the pure leaf material.

Stone-Grinding: Where Magic Happens

The tencha is then ground between two granite stones, rotating at just 30-40 RPM. This slow, deliberate process prevents heat buildup that would degrade the delicate compounds. It takes nearly one hour to produce just 30 grams of matcha powder.

The Ceremony

At Tea Pulse, we honor this tradition with every cup. Our ceremonial-grade matcha is whisked at exactly 80°C with a chasen (bamboo whisk) in a W-pattern motion until a fine, creamy froth forms on the surface.

Pro Tips for Home Brewing

1. Water temperature matters: 80°C — never boiling
2. Sift your matcha: prevents clumps for a silkier texture
3. Whisk with intention: rapid W-motion, not circular stirring
4. Drink immediately: matcha settles and oxidizes within minutes

Experience the difference that true ceremonial matcha makes. Visit us and watch our tea masters prepare your perfect bowl.`,
    coverImage: "https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=1200",
    author: "Mei Lin",
  },
  {
    title: "Oolong Tea: The Infinite Spectrum Between Green and Black",
    slug: "oolong-tea-spectrum",
    excerpt: "Oolong is the most complex and diverse category of tea. Explore how oxidation levels from 8% to 85% create an infinite spectrum of flavors.",
    content: `If green tea is a watercolor painting and black tea is oil on canvas, oolong is the entire spectrum between them. This semi-oxidized tea represents the pinnacle of the tea maker's craft.

What Makes Oolong Special?

Unlike green tea (minimal oxidation) or black tea (full oxidation), oolong teas are oxidized anywhere from 8% to 85%. This means every oolong is a unique expression of the tea maker's decisions — when to stop oxidation, how to shape the leaves, and the roasting technique.

The Four Great Oolong Regions

Fujian, China — Tieguanyin and Da Hong Pao
The birthplace of oolong. Tieguanyin (Iron Goddess of Mercy) ranges from light and floral to deeply roasted with notes of charcoal and stone fruit. Da Hong Pao (Big Red Robe) is among the most expensive teas in the world, with a mineral complexity that evolves across 7+ infusions.

Taiwan — High Mountain Oolong
Grown above 1,000 meters, Taiwan's gaoshan (high mountain) oolongs are prized for their creamy texture and orchid fragrance. The cool mountain air and morning mist create leaves thick with essential oils. Alishan, Lishan, and Dayuling are names worth remembering.

Guangdong, China — Dan Cong
Phoenix Mountain Dan Cong oolongs are famous for their single-bush origins and natural fragrance mimicking flowers and fruits. Each bush produces leaves with distinct aromatic profiles — honey orchid, almond, osmanthus, and ginger flower among them.

Wuyi Mountains — Rock Oolong (Yancha)
Grown in mineral-rich rocky soil, Wuyi yancha has a distinctive "rock rhyme" (yan yun) — a lingering mineral sweetness that tea connoisseurs spend lifetimes appreciating.

How We Brew Oolong at Tea Pulse

We use the gongfu cha method: 5g of leaf in a 100ml gaiwan, flash-steeped with water just off the boil. Each infusion reveals new dimensions — floral notes give way to fruit, then honey, then mineral sweetness, often lasting 8+ infusions from a single serving of leaves.

Discover our rotating selection of single-origin oolongs, sourced directly from tea masters we've known for decades.`,
    coverImage: "https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=1200",
    author: "Wei Chen",
  },
  {
    title: "Bubble Tea: The Global Phenomenon Born in Taiwan",
    slug: "bubble-tea-global-phenomenon",
    excerpt: "From a simple drink stand in Taichung to a multi-billion dollar global industry. The story of boba is a story of creativity, culture, and chewy tapioca pearls.",
    content: `In 1988, in a small tea shop in Taichung, Taiwan, a tea maker named Lin Hsiu Hui decided to pour her fen yuan (tapioca pudding) into her iced Assam tea during a staff meeting. What happened next changed beverage history forever.

The Accidental Invention

Lin's spontaneous combination of sweet, chewy tapioca balls with cold milk tea became an instant hit. The shop's customers began asking for "the drink with the balls," and bubble tea — or boba — was born.

From Taiwan to the World

Throughout the 1990s, bubble tea spread across Asia. By the 2000s, it had reached the West Coast of America, riding the wave of Asian-American culture. Today, the global bubble tea market is valued at over $3 billion and growing.

The Science of Perfect Pearls

At Tea Pulse, we cook our tapioca pearls fresh every 2 hours. The process is exacting: pearls must be boiled at precisely 100°C for 30 minutes, then steeped in our house-made brown sugar syrup for another 30 minutes. The result? Pearls that are chewy on the outside, tender at the center, and perfectly sweet throughout.

Beyond the Classic

While brown sugar milk tea remains the king, we're constantly innovating:

- Osmanthus Oolong Boba: Floral Taiwanese oolong meets honey-soaked pearls
- Matcha Cloud Boba: Ceremonial matcha with cream cheese foam
- Durian Creamy Milk: Our seasonal superstar for adventurous palates
- Passion Fruit Green Tea with Crystal Jelly: Light, refreshing, tropical

The Tea Pulse Difference

We refuse to use powdered creamers or artificial syrups. Every drink starts with real tea leaves, steeped to order. Our milk teas use fresh whole milk. Our fruit teas use real fruit. Because bubble tea deserves to be as premium as any other beverage.

Come taste the evolution.`,
    coverImage: "https://images.pexels.com/photos/6412836/pexels-photo-6412836.jpeg?auto=compress&cs=tinysrgb&w=1200",
    author: "Sarah Tan",
  },
  {
    title: "Tea & Food Pairing: A Complete Guide",
    slug: "tea-food-pairing-guide",
    excerpt: "Move over, wine. Tea is the ultimate food-pairing beverage. Learn which teas complement your favorite dishes.",
    content: `Wine has long dominated the conversation around food pairing. But tea — with its incredible range of flavors, textures, and aromas — is actually a more versatile pairing companion.

Why Tea Excels at Pairing

1. Temperature range: Hot, warm, or iced
2. Tannin control: From zero (white tea) to robust (Assam black)
3. Umami potential: Especially in Japanese greens
4. Aromatic complexity: Floral, fruity, roasted, mineral, sweet, vegetal
5. Zero alcohol: Pairs with breakfast, lunch, dinner, and dessert

The Golden Rules of Tea Pairing

Match Intensity: Light foods → Light teas. Rich foods → Bold teas.
Green salads and delicate seafoods pair beautifully with white tea or light green tea. Hearty meats and chocolate desserts need roasted oolongs or robust black teas.

Complement or Contrast: Both strategies work.
A floral oolong complements a fruit tart by echoing its sweetness. A smoky lapsang souchong contrasts with creamy cheese by cutting through the richness.

Regional Pairing: What grows together, goes together.
Japanese green tea with sushi. Darjeeling with Indian cuisine. Taiwanese oolong with night market snacks. The agricultural conditions that create a region's cuisine also shape its tea.

Our Favorite Pairings

Morning: Silver Needle white tea + fresh croissant
The honeyed delicacy of white tea doesn't overwhelm a buttery pastry. Pure elegance.

Lunch: Tieguanyin oolong + sushi
The floral, slightly creamy character bridges the gap between rice, fish, and soy sauce.

Afternoon: Earl Grey + shortbread
The bergamot citrus cuts through butter while vanilla notes in the tea complement the cookie.

Dinner: Da Hong Pao rock oolong + grilled steak
The roasted, mineral character stands up to charred meat beautifully.

Dessert: Golden Assam + dark chocolate
Full-bodied maltiness meets bittersweet cocoa. A pairing made in heaven.

Visit our stores to explore our seasonal pairing menus, curated by our tea masters.`,
    coverImage: "https://images.pexels.com/photos/12517410/pexels-photo-12517410.jpeg?auto=compress&cs=tinysrgb&w=1200",
    author: "Mei Lin",
  },
  {
    title: "The Health Benefits of Daily Tea Drinking",
    slug: "health-benefits-daily-tea",
    excerpt: "Science confirms what tea drinkers have known for millennia: a daily cup of tea is one of the best things you can do for your health.",
    content: `For over 4,000 years, tea has been consumed not just for pleasure but for wellbeing. Modern science is now catching up, confirming what ancient wisdom has long suggested.

L-Theanine: The Calm Focus Molecule

Tea is unique among caffeinated beverages because it contains L-theanine, an amino acid that promotes relaxation without drowsiness. L-theanine increases alpha brain waves — the same state achieved during meditation. Combined with caffeine, it creates a state of "calm alertness" that improves focus and creativity.

This is why tea drinkers often describe their energy as "clean" compared to coffee's jittery stimulation. At Tea Pulse, our matcha is especially rich in L-theanine due to the shade-growing process.

Catechins: Powerful Antioxidants

EGCG (epigallocatechin gallate) is the most potent catechin in tea, particularly abundant in green tea. Research suggests it may:

- Reduce inflammation
- Support cardiovascular health
- Boost metabolic rate
- Protect cells from oxidative stress

Matcha contains up to 137 times more EGCG than regular steeped green tea — because you consume the entire leaf.

Heart Health

A study published in the European Journal of Preventive Cardiology followed 100,000 participants over 7 years. Those who drank tea 3+ times per week had a 20% lower risk of heart disease and stroke compared to non-drinkers. The benefits were attributed to tea's ability to improve blood vessel function and reduce LDL cholesterol oxidation.

Gut Health

The polyphenols in tea act as prebiotics, feeding beneficial gut bacteria. Oolong and pu-erh teas, which undergo fermentation, are particularly rich in gut-friendly compounds. A healthy gut microbiome is linked to improved immunity, better mood, and reduced inflammation.

Mindful Ritual

Perhaps tea's greatest health benefit is the ritual itself. Taking 10 minutes to brew and savor a cup is a form of mindfulness practice. In a world of constant stimulation, the simple act of making tea forces us to slow down, breathe, and be present.

Tea is not medicine. But it might just be the healthiest daily habit you can adopt.`,
    coverImage: "https://images.pexels.com/photos/905485/pexels-photo-905485.jpeg?auto=compress&cs=tinysrgb&w=1200",
    author: "Dr. Aisha Rahman",
  },
  {
    title: "Behind the Blend: How We Create Our Signature Drinks",
    slug: "behind-the-blend-signature-drinks",
    excerpt: "Ever wonder how your favorite Tea Pulse drink came to be? Step inside our R&D lab and discover the art and science of drink creation.",
    content: `Every drink on the Tea Pulse menu has a story. Behind each one is months — sometimes years — of experimentation, tasting, and refinement. Here's a behind-the-scenes look at how we create our signatures.

Phase 1: The Spark

Inspiration comes from everywhere. A childhood memory of eating osmanthus jelly in Hong Kong. A trip to a vanilla farm in Madagascar. A trending flavor on the streets of Taipei.

Our R&D team maintains a "flavor journal" — a living document of every idea, no matter how wild. Durian milk tea? It started as a joke in the journal. Now it's our bestselling seasonal drink.

Phase 2: Sourcing

Once we commit to a concept, our tea buyers go to work. We source directly from tea gardens in China, Taiwan, Japan, India, and Sri Lanka. Every ingredient — from the tea base to the toppings — must meet our quality standards.

We visit farms. We taste dozens of samples. We build relationships with growers who share our obsession with quality.

Phase 3: The Lab

This is where science meets art. Our drink developers work in small batches, adjusting variables:

- Tea-to-water ratio
- Steeping time and temperature
- Sweetener type and concentration
- Milk or dairy alternative
- Topping compatibility
- Ice dilution factor

A single drink might go through 50+ iterations before we're satisfied.

Phase 4: The Tasting Panel

Every Friday, our entire team — from baristas to the CEO — gathers for a blind tasting. Drinks are evaluated on:

- First impression (aroma and appearance)
- Flavor balance (sweet, bitter, sour, umami)
- Texture and mouthfeel
- Finish and aftertaste
- "Craveability" — would you order this again?

A drink must score 4 out of 5 across all categories to make the menu.

Phase 5: The Soft Launch

New drinks debut at a single store for two weeks. We collect customer feedback, observe ordering patterns, and make final adjustments before rolling out nationwide.

Creating the perfect drink is a journey. And we're just getting started.`,
    coverImage: "https://images.pexels.com/photos/5335709/pexels-photo-5335709.jpeg?auto=compress&cs=tinysrgb&w=1200",
    author: "Wei Chen",
  },
];

async function seed() {
  console.log("📝 Seeding blog posts...");

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`  ✅ ${post.title}`);
  }

  console.log(`\n🎉 ${posts.length} blog posts seeded!`);
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
