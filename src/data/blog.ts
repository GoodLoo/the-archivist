import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "collecting-guide-2026",
    title: "The Ultimate Guide to Collecting Premium Figurines in 2026",
    excerpt:
      "From limited editions to grail hunting, here's everything you need to know about building a world-class collection.",
    content: `Welcome to the definitive guide for figurine collecting in 2026. Whether you're a seasoned collector or just starting your journey, the landscape of premium collectibles has evolved dramatically.

**Understanding the Market**

The collectible figurine market has seen unprecedented growth. With limited edition runs and artist collaborations becoming the norm, knowing where to invest your passion (and budget) is crucial.

**Key Factors to Consider**

1. **Material Quality**: Premium PVC, cold-cast porcelain, and polystone offer different levels of detail and durability.
2. **Articulation**: Static statues vs. fully articulated figures — each has its place in a well-rounded collection.
3. **Packaging**: Mint condition boxes can significantly impact resale value.
4. **Authentication**: Always verify authenticity through serial numbers and certificates.

**Building Your Collection**

Start with characters that resonate with you personally. A curated collection of pieces you love will always be more satisfying than a scattergun approach. Focus on one or two categories and build depth.

**Storage and Display**

Proper display is an art form. Consider dust-free cabinets, UV-protective glass, and strategic lighting to showcase your collection like the museum it deserves to be.

Happy hunting, Archivist.`,
    image: "https://placehold.co/1200x600/333333/DC143C?text=Collection+Guide",
    author: "The Archivist Team",
    date: "2026-07-15",
    category: "Guides",
    featured: true,
  },
  {
    id: "marvel-phase-7",
    title: "Marvel Phase 7: New Figurines Announced",
    excerpt:
      "Get ready for the next wave of Marvel collectibles inspired by the upcoming Phase 7 lineup.",
    content: `Marvel Studios has unveiled its Phase 7 slate, and we've already secured the licensing for an incredible new line of premium figurines...

Full article content with detailed analysis of each announced figure, release dates, and pre-order information.`,
    image: "https://placehold.co/1200x600/333333/DC143C?text=Marvel+Phase+7",
    author: "Alex Chen",
    date: "2026-07-12",
    category: "News",
    featured: true,
  },
  {
    id: "dc-absolutely-timeless",
    title: "DC's Absolutely Timeless Line: A Collector's Dream",
    excerpt:
      "DC's new premium line redefines what collector-grade figurines can be.",
    content: `DC Comics has raised the bar with their Absolutely Timeless line, featuring museum-quality statues...

Full article with detailed review of the line, pricing analysis, and comparison with other premium lines.`,
    image: "https://placehold.co/1200x600/333333/1E90FF?text=DC+Timeless",
    author: "Sarah Mitchell",
    date: "2026-07-08",
    category: "Reviews",
    featured: false,
  },
  {
    id: "display-techniques",
    title: "Museum-Quality Display Techniques for Your Collection",
    excerpt:
      "Transform your shelves into a gallery with these professional display tips.",
    content: `Creating the perfect display for your collection is an art form in itself...

Full article with lighting techniques, shelving options, and arrangement strategies.`,
    image: "https://placehold.co/1200x600/333333/FF6F00?text=Display+Tips",
    author: "The Archivist Team",
    date: "2026-07-05",
    category: "Guides",
    featured: false,
  },
  {
    id: "anime-figurine-market",
    title: "The Booming Anime Figurine Market in 2026",
    excerpt:
      "Anime collectibles are dominating the market. Here's what's driving the trend.",
    content: `The anime figurine market has exploded in 2026, with series like Jujutsu Kaisen and Demon Slayer leading the charge...

Full market analysis with trends, pricing data, and upcoming releases.`,
    image: "https://placehold.co/1200x600/333333/FF69B4?text=Anime+Market",
    author: "Yuki Tanaka",
    date: "2026-07-01",
    category: "Trends",
    featured: false,
  },
  {
    id: "vault-exclusive-originals",
    title: "Behind the Scenes: Creating Our Premium Originals",
    excerpt:
      "An exclusive look at how The Archivist designs and produces original figurines.",
    content: `Ever wondered what goes into creating an original figurine from concept to production...

Full behind-the-scenes article with interviews with sculptors, painters, and designers.`,
    image: "https://placehold.co/1200x600/333333/D4AF37?text=Originals+BTS",
    author: "Marcus Webb",
    date: "2026-06-28",
    category: "Behind the Scenes",
    featured: true,
  },
  {
    id: "star-wars-40th",
    title: "Star Wars: 40 Years of Premium Collectibles",
    excerpt:
      "Celebrating four decades of the galaxy's most sought-after figurines.",
    content: `From the original Kenner figures to today's hyper-realistic premium statues...

Full retrospective with iconic pieces from each era and their current market values.`,
    image: "https://placehold.co/1200x600/333333/000000?text=Star+Wars+40",
    author: "James O'Brien",
    date: "2026-06-20",
    category: "Features",
    featured: false,
  },
  {
    id: "gaming-2026-releases",
    title: "Most Anticipated Gaming Figurines of Late 2026",
    excerpt:
      "From Elden Ring to GTA VI, the gaming figurines you need to pre-order now.",
    content: `The gaming figurine calendar for late 2026 is absolutely stacked with incredible releases...

Full preview with release dates, pricing, and where to pre-order.`,
    image: "https://placehold.co/1200x600/333333/00C853?text=Gaming+2026",
    author: "Alex Chen",
    date: "2026-06-15",
    category: "News",
    featured: false,
  },
];

export const getBlogPostById = (id: string): BlogPost | undefined =>
  blogPosts.find((p) => p.id === id);

export const getFeaturedPosts = (): BlogPost[] =>
  blogPosts.filter((p) => p.featured);

export const getRecentPosts = (count: number = 6): BlogPost[] =>
  blogPosts.slice(0, count);
