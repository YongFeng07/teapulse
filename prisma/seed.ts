import { PrismaClient, RewardType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TeaPulse...");
  const hash = (pw: string) => bcrypt.hash(pw, 10);

  // Admin + users
  await prisma.user.upsert({
    where: { email: "yongfeng3318@gmail.com" },
    update: {},
    create: { email: "yongfeng3318@gmail.com", password: await hash("12345678"), name: "Admin", points: 9999 },
  });
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@teapulse.com" },
    update: {},
    create: { email: "demo@teapulse.com", password: await hash("password123"), name: "Alex Lim", phone: "+60123456789", points: 480, avatar: "🧋" },
  });
  const u2 = await prisma.user.upsert({ where: { email: "mei@example.com" }, update: {}, create: { email: "mei@example.com", password: await hash("test123"), name: "Mei Lin", points: 120 } });
  const u3 = await prisma.user.upsert({ where: { email: "raj@example.com" }, update: {}, create: { email: "raj@example.com", password: await hash("test123"), name: "Raj Kumar", points: 240 } });
  const u4 = await prisma.user.upsert({ where: { email: "sarah@example.com" }, update: {}, create: { email: "sarah@example.com", password: await hash("test123"), name: "Sarah Wong", points: 85 } });

  // Categories
  const [milkTea, fruitTea, matcha, coffee, specials, seasonal] = await Promise.all([
    prisma.category.upsert({ where: { slug: "milk-tea" }, update: {}, create: { name: "Milk Tea", slug: "milk-tea", sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "fruit-tea" }, update: {}, create: { name: "Fruit Tea", slug: "fruit-tea", sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: "matcha" }, update: {}, create: { name: "Matcha", slug: "matcha", sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: "coffee" }, update: {}, create: { name: "Coffee", slug: "coffee", sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: "specials" }, update: {}, create: { name: "Specials", slug: "specials", sortOrder: 5 } }),
    prisma.category.upsert({ where: { slug: "seasonal" }, update: {}, create: { name: "Seasonal", slug: "seasonal", sortOrder: 6 } }),
  ]);

  const drinks = [
    // ── Milk Tea ──
    {
      name: "Signature Brown Sugar Boba", slug: "signature-brown-sugar-boba",
      description: "Hand-rolled tapioca pearls in rich brown sugar syrup with fresh milk. Tiger-striped, silky-smooth.",
      longDesc: "Our most iconic creation. Premium Ceylon black tea brewed at 85°C, layered over hand-rolled tapioca pearls slow-cooked for 6 hours in raw brown sugar syrup. The signature tiger-stripe effect — caramel rivers cascading through creamy white milk. Best enjoyed immediately, stirred gently.",
      price: 16.9, image: "https://images.pexels.com/photos/6412836/pexels-photo-6412836.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Ceylon Black Tea,Whole Milk,Brown Sugar Syrup,Tapioca Pearls,Ice",
      badges: "Bestseller,Staff Pick", calories: 320, rating: 4.9, reviewCount: 3, isPopular: true, isSeasonal: false, categoryId: milkTea.id,
    },
    {
      name: "Jasmine Pearl Milk Tea", slug: "jasmine-pearl-milk-tea",
      description: "Fragrant jasmine green tea blended with silky oat milk and fresh tapioca pearls. Floral and dreamy.",
      longDesc: "Jasmine flowers cold-scented with Dragon Well green tea over 48 hours, blended with lightly sweetened oat milk. Pearls cooked fresh every 4 hours. A cup of quiet luxury.",
      price: 14.9, image: "https://images.pexels.com/photos/5946635/pexels-photo-5946635.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Jasmine Green Tea,Oat Milk,Tapioca Pearls,Jasmine Syrup",
      badges: "Vegan,Popular", calories: 240, rating: 4.7, reviewCount: 2, isPopular: true, isSeasonal: false, categoryId: milkTea.id,
    },
    {
      name: "Classic Taro Milk Tea", slug: "classic-taro-milk-tea",
      description: "Real steamed taro root blended with creamy milk tea. Naturally purple, naturally delicious.",
      longDesc: "Real steamed taro root — never artificial powder — blended with our house milk tea base and a touch of coconut cream for tropical depth.",
      price: 15.9, image: "https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Real Taro Root,Black Tea,Whole Milk,Coconut Cream,Cane Sugar",
      badges: "No Artificial Colours", calories: 290, rating: 4.5, reviewCount: 2, isPopular: false, isSeasonal: false, categoryId: milkTea.id,
    },
    {
      name: "Hokkaido Caramel Latte", slug: "hokkaido-caramel-latte",
      description: "Rich double-cream milk tea inspired by Hokkaido dairy, topped with salted caramel foam.",
      longDesc: "Double-cream milk base enriched with house-made caramel toffee sauce over strong Assam black tea. Finished with thick salted caramel foam that slowly melts — an evolving flavour profile sip to sip.",
      price: 17.9, image: "https://images.pexels.com/photos/4440208/pexels-photo-4440208.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Assam Black Tea,Double Cream Milk,Caramel Toffee,Salted Caramel Foam",
      badges: "Premium,Rich", calories: 380, rating: 4.6, reviewCount: 2, isPopular: false, isSeasonal: false, categoryId: milkTea.id,
    },
    {
      name: "Oreo Milk Tea", slug: "oreo-milk-tea",
      description: "Crushed Oreo cookies blended with premium milk tea and topped with cream. Indulgent and irresistible.",
      longDesc: "We blend real Oreo cookies into our signature milk tea base, creating a cookies-and-cream experience with a tea twist. Topped with fresh whipped cream and Oreo crumble.",
      price: 17.5, image: "https://images.pexels.com/photos/3625373/pexels-photo-3625373.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Black Tea,Whole Milk,Oreo Cookies,Whipped Cream,Vanilla",
      badges: "Indulgent,New", calories: 420, rating: 4.6, reviewCount: 1, isPopular: false, isSeasonal: false, categoryId: milkTea.id,
    },
    // ── Fruit Tea ──
    {
      name: "Passion Fruit Green Tea", slug: "passion-fruit-green-tea",
      description: "Fresh passion fruit married with crisp green tea. Vibrant, tangy, and endlessly refreshing.",
      longDesc: "Fresh passion fruit pressed daily and combined with Bi Luo Chun green tea. No artificial flavours — just real tropical punch. Served over hand-chipped ice.",
      price: 15.5, image: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Fresh Passion Fruit,Bi Luo Chun Green Tea,Cane Sugar,Lemon Juice",
      badges: "Refreshing,No Milk", calories: 180, rating: 4.8, reviewCount: 3, isPopular: true, isSeasonal: false, categoryId: fruitTea.id,
    },
    {
      name: "Peach Oolong Fizz", slug: "peach-oolong-fizz",
      description: "White peach nectar meets premium oolong with a sparkling mineral water finish.",
      longDesc: "White peach nectar from Yamanashi Prefecture meets lightly oxidised Tie Guan Yin oolong, topped with chilled sparkling mineral water. Light, sophisticated, perfect for warm weather.",
      price: 16.5, image: "https://images.pexels.com/photos/2668534/pexels-photo-2668534.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "White Peach Nectar,Tie Guan Yin Oolong,Sparkling Water,Honey",
      badges: "Sparkling,Light", calories: 155, rating: 4.4, reviewCount: 1, isPopular: false, isSeasonal: false, categoryId: fruitTea.id,
    },
    {
      name: "Lychee Rose Tea", slug: "lychee-rose-tea",
      description: "Delicate lychee paired with rose petals and white tea. Floral, fruity, and feminine.",
      longDesc: "Dried rose petals steeped overnight with Silver Needle white tea, combined with fresh lychee syrup — made from peeled whole lychees, never concentrate.",
      price: 16.9, image: "https://images.pexels.com/photos/5946636/pexels-photo-5946636.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Silver Needle White Tea,Fresh Lychee,Dried Rose Petals,Rock Sugar",
      badges: "Floral,Light Caffeine", calories: 165, rating: 4.6, reviewCount: 2, isPopular: false, isSeasonal: false, categoryId: fruitTea.id,
    },
    {
      name: "Mango Pomelo Sago", slug: "mango-pomelo-sago",
      description: "Hong Kong-style fresh mango with pomelo sacs and sago pearls in coconut cream.",
      longDesc: "A beloved Hong Kong dessert drink reimagined — fresh Alphonso mango blended with coconut cream, loaded with pomelo sacs and mini sago pearls. Rich, refreshing, and texturally divine.",
      price: 18.5, image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Fresh Alphonso Mango,Pomelo,Sago Pearls,Coconut Cream,Rock Sugar",
      badges: "HK Style,Seasonal", calories: 290, rating: 4.8, reviewCount: 2, isPopular: true, isSeasonal: true, categoryId: fruitTea.id,
    },
    {
      name: "Strawberry Yakult Tea", slug: "strawberry-yakult-tea",
      description: "Fresh strawberries with probiotic Yakult and green tea. Sweet, tangy, and gut-friendly.",
      longDesc: "Fresh strawberry puree meets the iconic Yakult probiotic drink over chilled green tea. A fun, approachable drink that's as good for you as it is delicious.",
      price: 15.9, image: "https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Fresh Strawberry,Yakult,Green Tea,Lemon Juice",
      badges: "Probiotic,No Milk", calories: 160, rating: 4.5, reviewCount: 1, isPopular: false, isSeasonal: false, categoryId: fruitTea.id,
    },
    // ── Matcha ──
    {
      name: "Ceremonial Matcha Latte", slug: "ceremonial-matcha-latte",
      description: "Uji ceremonial-grade matcha whisked with oat milk. Earthy, smooth, beautifully layered.",
      longDesc: "Sourced from a family-owned farm in Uji, Kyoto. Sifted and whisked to order in a traditional chakin bowl before being poured over steamed oat milk. Intense umami depth, bright emerald colour.",
      price: 18.9, image: "https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Uji Ceremonial Matcha,Oat Milk,Bamboo Sugar,Filtered Water",
      badges: "Vegan,High Antioxidants,Premium", calories: 195, rating: 4.9, reviewCount: 3, isPopular: true, isSeasonal: false, categoryId: matcha.id,
    },
    {
      name: "Matcha Cloud Boba", slug: "matcha-cloud-boba",
      description: "Premium matcha with brown sugar pearls topped with salted cheese foam cloud.",
      longDesc: "Matcha latte sits beneath impossibly light salted cream cheese foam — the cloud. As you drink, the savoury foam melts through the sweet matcha. Brown sugar pearls add the final QQ texture.",
      price: 19.9, image: "https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Uji Matcha,Brown Sugar Pearls,Cream Cheese Foam,Oat Milk,Sea Salt",
      badges: "Bestseller,Instagram Worthy", calories: 350, rating: 4.8, reviewCount: 2, isPopular: true, isSeasonal: false, categoryId: matcha.id,
    },
    {
      name: "Hojicha Brown Sugar", slug: "hojicha-brown-sugar",
      description: "Roasted hojicha with brown sugar milk. Warm, caramel-like, deeply comforting.",
      longDesc: "Hojicha — roasted green tea — has naturally caramel, toasty flavour with minimal caffeine. Combined with house-made brown sugar milk and a thick layer of brown sugar pearls.",
      price: 17.9, image: "https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Roasted Hojicha,Brown Sugar Milk,Tapioca Pearls,Caramel Drizzle",
      badges: "Low Caffeine,Cosy", calories: 285, rating: 4.5, reviewCount: 1, isPopular: false, isSeasonal: false, categoryId: matcha.id,
    },
    {
      name: "Matcha Strawberry Layer", slug: "matcha-strawberry-layer",
      description: "Vibrant layers of fresh strawberry milk and ceremonial matcha. A feast for the eyes.",
      longDesc: "Fresh strawberry compote layered with ceremonial matcha and oat milk — the pink and green layers create a stunning visual effect. Stir gently to combine or drink in layers for different taste experiences.",
      price: 20.9, image: "https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Ceremonial Matcha,Fresh Strawberry,Oat Milk,Coconut Sugar",
      badges: "Instagram Worthy,Premium,New", calories: 260, rating: 4.7, reviewCount: 1, isPopular: false, isSeasonal: false, categoryId: matcha.id,
    },
    // ── Coffee ──
    {
      name: "Oolong Dirty Latte", slug: "oolong-dirty-latte",
      description: "Cold-brew Wuyi Cliff oolong poured over oat milk. The tea drinker's perfect coffee.",
      longDesc: "Aged Wuyi Cliff oolong cold-brewed for 20 hours, slowly poured over chilled oat milk — creating the dirty pour effect. Complex, layered, the perfect space between strong tea and smooth coffee.",
      price: 17.9, image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Aged Wuyi Oolong,Oat Milk,Cane Sugar",
      badges: "Tea x Coffee,Bold", calories: 140, rating: 4.7, reviewCount: 2, isPopular: false, isSeasonal: false, categoryId: coffee.id,
    },
    {
      name: "Tea-Infused Cold Brew", slug: "tea-infused-cold-brew",
      description: "16-hour cold brew infused with Yunnan black tea. Silky smooth with natural sweetness.",
      longDesc: "Specialty-grade coffee steeped in filtered water for 16 hours alongside single-origin Yunnan golden tips black tea. Naturally sweet, silky smooth, with deep chocolate and floral honey notes.",
      price: 18.9, image: "https://images.pexels.com/photos/1233528/pexels-photo-1233528.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Specialty Coffee,Yunnan Golden Tips,Filtered Water",
      badges: "Cold Brew,No Sugar Added", calories: 20, rating: 4.6, reviewCount: 1, isPopular: false, isSeasonal: false, categoryId: coffee.id,
    },
    {
      name: "Dalgona Matcha Coffee", slug: "dalgona-matcha-coffee",
      description: "Whipped coffee cloud over iced matcha milk. Two worlds colliding beautifully.",
      longDesc: "Dalgona coffee foam — whipped instant coffee, sugar and hot water — floated over iced matcha oat milk. The bitter-sweet coffee cloud slowly dissolves into the earthy matcha. Pure theatre, pure delicious.",
      price: 19.5, image: "https://images.pexels.com/photos/4440208/pexels-photo-4440208.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Whipped Coffee,Uji Matcha,Oat Milk,Cane Sugar",
      badges: "Coffee x Matcha,Trending", calories: 280, rating: 4.7, reviewCount: 1, isPopular: true, isSeasonal: false, categoryId: coffee.id,
    },
    // ── Specials ──
    {
      name: "Osmanthus Gold Tea", slug: "osmanthus-gold-tea",
      description: "Premium Tie Guan Yin oolong with dried osmanthus flowers. Our most elegant creation.",
      longDesc: "Osmanthus — the golden flower of autumn — carries a unique apricot-honey fragrance found nowhere else. Blended with premium Anxi Tie Guan Yin oolong. Served straight, no milk, to honour the purity of the floral-tea harmony.",
      price: 21.9, image: "https://images.pexels.com/photos/19996404/pexels-photo-19996404.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Anxi Tie Guan Yin,Dried Osmanthus Blossoms,Rock Sugar,Filtered Water",
      badges: "Premium,No Milk,Award Winning", calories: 85, rating: 4.9, reviewCount: 3, isPopular: true, isSeasonal: false, categoryId: specials.id,
    },
    {
      name: "Black Sesame Milk Tea", slug: "black-sesame-milk-tea",
      description: "House-made black sesame paste swirled into premium milk tea. Mysterious and unforgettable.",
      longDesc: "Black sesame paste — toasted, ground, and sweetened in-house — swirled through our premium milk tea. Deep charcoal-grey, deeply nutty. Paired with grass jelly, it becomes one of our most memorable drinks.",
      price: 19.9, image: "https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Black Sesame Paste,Assam Black Tea,Whole Milk,Cane Sugar",
      badges: "Unique,Rich", calories: 340, rating: 4.7, reviewCount: 2, isPopular: false, isSeasonal: false, categoryId: specials.id,
    },
    {
      name: "Pandan Gula Melaka", slug: "pandan-gula-melaka",
      description: "Fresh pandan leaf blended with aromatic gula melaka palm sugar and coconut milk. Truly Malaysian.",
      longDesc: "A love letter to Malaysian heritage. Fresh pandan leaves are blended and strained daily, combined with house-made gula melaka syrup and rich coconut milk over pandan jelly. Uniquely and proudly Malaysian.",
      price: 16.9, image: "https://images.pexels.com/photos/5946635/pexels-photo-5946635.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Fresh Pandan Leaf,Gula Melaka,Coconut Milk,Pandan Jelly",
      badges: "Malaysian Heritage,Vegan", calories: 220, rating: 4.8, reviewCount: 2, isPopular: true, isSeasonal: false, categoryId: specials.id,
    },
    {
      name: "Butterfly Pea Lemonade", slug: "butterfly-pea-lemonade",
      description: "Colour-changing butterfly pea flower tea with fresh lemonade. Magic in a cup.",
      longDesc: "Butterfly pea flowers are steeped to create an electric blue tea. When fresh lemon juice is added, it transforms to vibrant purple before your eyes — a natural pH reaction. Refreshing, magical, and completely natural.",
      price: 17.9, image: "https://images.pexels.com/photos/2668534/pexels-photo-2668534.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Butterfly Pea Flowers,Fresh Lemon Juice,Honey,Sparkling Water",
      badges: "Colour Changing,Instagram Worthy,Vegan", calories: 95, rating: 4.8, reviewCount: 2, isPopular: true, isSeasonal: false, categoryId: specials.id,
    },
    // ── Seasonal ──
    {
      name: "Durian Creamy Milk Tea", slug: "durian-creamy-milk-tea",
      description: "Premium Musang King durian blended into silky milk tea. Fearless and magnificent.",
      longDesc: "For the fearless durian lover. We blend real Musang King durian flesh — the king of Malaysian fruits — into our rich milk tea base. Intensely creamy, powerfully aromatic, magnificently controversial. Only available when in season.",
      price: 24.9, image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Musang King Durian,Black Tea,Full Cream Milk,Vanilla",
      badges: "Seasonal,Premium,Daring", calories: 450, rating: 4.9, reviewCount: 1, isPopular: true, isSeasonal: true, categoryId: seasonal.id,
    },
    {
      name: "Strawberry Matcha Cheesecake", slug: "strawberry-matcha-cheesecake",
      description: "Ceremonial matcha with fresh strawberry and cream cheese foam. Dessert in a cup.",
      longDesc: "Inspired by a matcha strawberry cheesecake — ceremonial matcha base with fresh strawberry puree, topped with cream cheese foam and crushed graham cracker crumble. A complete dessert experience.",
      price: 22.9, image: "https://images.pexels.com/photos/5946636/pexels-photo-5946636.jpeg?auto=compress&cs=tinysrgb&w=800",
      ingredients: "Ceremonial Matcha,Fresh Strawberry,Cream Cheese,Oat Milk,Graham Cracker",
      badges: "Seasonal,Dessert Drink,New", calories: 380, rating: 4.8, reviewCount: 1, isPopular: false, isSeasonal: true, categoryId: seasonal.id,
    },
  ];

  const createdDrinks: Record<string, string> = {};
  for (const d of drinks) {
    const drink = await prisma.drink.upsert({
      where: { slug: d.slug },
      update: { rating: d.rating, reviewCount: d.reviewCount, image: d.image, isPopular: d.isPopular },
      create: d,
    });
    createdDrinks[d.slug] = drink.id;
  }
  console.log(`✅ ${drinks.length} drinks seeded`);

  // Reviews
  const reviewsData = [
    { slug: "signature-brown-sugar-boba", reviews: [
      { user: demoUser.id, rating: 5, comment: "Absolutely the best boba in KL. The brown sugar pearls are perfectly cooked and the tiger stripe effect is stunning. Worth every ringgit.", days: 14 },
      { user: u2.id, rating: 5, comment: "My weekly ritual. Rich but not overpowering. The pearls have that perfect QQ bite.", days: 7 },
      { user: u3.id, rating: 5, comment: "Fresh pearls make all the difference. You can taste the quality immediately.", days: 3 },
    ]},
    { slug: "ceremonial-matcha-latte", reviews: [
      { user: u2.id, rating: 5, comment: "Real ceremonial grade, proper umami depth. Not the sweet powder most places use. Oat milk pairing is perfect.", days: 10 },
      { user: u4.id, rating: 5, comment: "I drive 30 minutes for this. Complex, earthy, and smooth. Nothing like it.", days: 5 },
      { user: demoUser.id, rating: 4, comment: "Excellent quality matcha. Would love a hot option too! Beautiful colour.", days: 2 },
    ]},
    { slug: "passion-fruit-green-tea", reviews: [
      { user: u3.id, rating: 5, comment: "Perfectly balanced between tart and sweet. You can taste real fruit, not flavouring.", days: 12 },
      { user: u4.id, rating: 5, comment: "Crystal clear, beautiful colour, incredible freshness. My go-to on hot days.", days: 8 },
      { user: u2.id, rating: 4, comment: "Lovely and refreshing. The green tea base is subtle and doesn't overpower.", days: 4 },
    ]},
    { slug: "osmanthus-gold-tea", reviews: [
      { user: demoUser.id, rating: 5, comment: "This drink literally smells like autumn. The osmanthus fragrance is otherworldly.", days: 6 },
      { user: u3.id, rating: 5, comment: "Unique and sophisticated. Most elegant tea drink I've had anywhere in Malaysia.", days: 3 },
      { user: u4.id, rating: 5, comment: "The gold colour is stunning. Worth every sen of the premium price.", days: 1 },
    ]},
    { slug: "matcha-cloud-boba", reviews: [
      { user: u2.id, rating: 5, comment: "The cheese foam is perfectly salted and incredibly light. Contrast with matcha is genius.", days: 9 },
      { user: u3.id, rating: 5, comment: "Visually stunning. The cream foam quality is exceptional. Best matcha drink I've had.", days: 4 },
    ]},
    { slug: "jasmine-pearl-milk-tea", reviews: [
      { user: u4.id, rating: 5, comment: "So delicate and fragrant. Jasmine comes through without overpowering. Oat milk works beautifully.", days: 11 },
      { user: demoUser.id, rating: 4, comment: "Beautiful floral drink. Authentic jasmine notes. Pearls have great texture.", days: 6 },
    ]},
    { slug: "pandan-gula-melaka", reviews: [
      { user: u3.id, rating: 5, comment: "This is Malaysian culture in a cup. The gula melaka is authentic and the pandan is real. So proud.", days: 5 },
      { user: u2.id, rating: 5, comment: "Incredible. Nothing artificial here. Tastes exactly like my grandmother's kitchen.", days: 3 },
    ]},
    { slug: "butterfly-pea-lemonade", reviews: [
      { user: u4.id, rating: 5, comment: "The colour change is absolutely magical. Kids and adults love it equally. Tastes amazing too!", days: 7 },
      { user: demoUser.id, rating: 5, comment: "Watched it transform from blue to purple right in front of me. Never seen anything like it.", days: 4 },
    ]},
    { slug: "oolong-dirty-latte", reviews: [
      { user: u3.id, rating: 5, comment: "I'm a coffee person but this converted me. The oolong cold brew is complex — smoky, floral, smooth.", days: 8 },
      { user: u4.id, rating: 4, comment: "Brilliant concept. Beautiful pour. My new morning drink.", days: 5 },
    ]},
    { slug: "mango-pomelo-sago", reviews: [
      { user: u2.id, rating: 5, comment: "Authentic Hong Kong style. The fresh mango is so fragrant and the pomelo adds perfect tang.", days: 6 },
      { user: u3.id, rating: 5, comment: "This is the real deal. Coconut cream is rich without being heavy. Outstanding.", days: 3 },
    ]},
  ];

  for (const { slug, reviews } of reviewsData) {
    const drinkId = createdDrinks[slug];
    if (!drinkId) continue;
    await prisma.review.deleteMany({ where: { drinkId } });
    for (const r of reviews) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - r.days);
      await prisma.review.create({ data: { drinkId, userId: r.user, rating: r.rating, comment: r.comment, createdAt } });
    }
  }
  console.log("✅ Reviews seeded");

  // Stores
  const storeData = [
    { name: "TeaPulse Pavilion KL", address: "168, Jalan Bukit Bintang", city: "Kuala Lumpur", phone: "+60 11-3178 0587", openHours: "10:00 AM – 10:00 PM", lat: 3.1488, lng: 101.7134 },
    { name: "TeaPulse Mid Valley", address: "Lingkaran Syed Putra, Mid Valley City", city: "Kuala Lumpur", phone: "+60 11-3178 0587", openHours: "10:00 AM – 10:00 PM", lat: 3.1178, lng: 101.6765 },
    { name: "TeaPulse 1 Utama", address: "1, Lebuh Bandar Utama", city: "Petaling Jaya", phone: "+60 11-3178 0587", openHours: "10:00 AM – 10:30 PM", lat: 3.1502, lng: 101.6151 },
    { name: "TeaPulse Sunway Pyramid", address: "3, Jalan PJS 11/15, Bandar Sunway", city: "Petaling Jaya", phone: "+60 11-3178 0587", openHours: "10:00 AM – 10:00 PM", lat: 3.0732, lng: 101.6074 },
  ];
  for (const s of storeData) {
    const ex = await prisma.store.findFirst({ where: { name: s.name } });
    if (!ex) await prisma.store.create({ data: s });
    else await prisma.store.update({ where: { id: ex.id }, data: { phone: s.phone } });
  }
  console.log("✅ Stores seeded");

  // Rewards
  const rewardData = [
    { name: "Free Classic Drink", description: "Any classic drink up to RM 16.90.", pointsCost: 200, type: RewardType.FREE_DRINK, value: 16.9 },
    { name: "RM 5 Off", description: "RM 5 discount on orders above RM 25.", pointsCost: 150, type: RewardType.DISCOUNT, value: 5 },
    { name: "Free Add-on", description: "Add any topping for free.", pointsCost: 80, type: RewardType.VOUCHER, value: 2.5 },
    { name: "Free Signature Drink", description: "Any Signature or Specials drink up to RM 22.", pointsCost: 350, type: RewardType.FREE_DRINK, value: 22 },
    { name: "RM 10 Off", description: "RM 10 off orders above RM 50.", pointsCost: 280, type: RewardType.DISCOUNT, value: 10 },
    { name: "Birthday Reward", description: "Free drink of your choice on your birthday month.", pointsCost: 0, type: RewardType.FREE_DRINK, value: 25 },
  ];
  for (const r of rewardData) {
    const ex = await prisma.reward.findFirst({ where: { name: r.name } });
    if (!ex) await prisma.reward.create({ data: r });
  }
  console.log("✅ Rewards seeded");

  // Announcements
  const announcementData = [
    { title: "New Seasonal Drink!", body: "Try our limited Durian Creamy Milk Tea while stocks last.", emoji: "🍂", isActive: true },
    { title: "Order Ahead & Skip the Queue", body: "Download the app or order online — your drink will be ready when you arrive.", emoji: "⚡", isActive: true },
    { title: "Earn Double Points This Weekend", body: "All orders Friday–Sunday earn 2× loyalty points. Don't miss it!", emoji: "⭐", isActive: true },
  ];
  for (const a of announcementData) {
    const ex = await prisma.announcement.findFirst({ where: { title: a.title } });
    if (!ex) await prisma.announcement.create({ data: a });
  }
  console.log("✅ Announcements seeded");
  console.log("\n🎉 Done!");
  console.log("   Admin: yongfeng3318@gmail.com / 12345678");
  console.log("   Demo:  demo@teapulse.com / password123");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
