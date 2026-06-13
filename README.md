This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




**Yes**, Groq's free tier has rate limits. Here are the exact limits for the model your code uses (`llama-3.3-70b-versatile`):

## 📊 **Groq Free Tier Limits (for your model)**

| Limit Type | Value |
|------------|-------|
| **Requests per minute (RPM)** | 30 requests/minute  |
| **Requests per day (RPD)** | 1,000 requests/day  |
| **Tokens per minute (TPM)** | 12,000 tokens/minute  |
| **Tokens per day (TPD)** | 100,000 tokens/day  |

## 🎯 **What This Means For You**

- **30 requests per minute** means you can send about 1 request every 2 seconds
- **1,000 requests per day** means roughly 40-50 conversations per day (depending on length)
- **The limit applies at the organization level** — creating multiple API keys won't increase it 

> **Important**: You hit whichever limit comes first. Even if you're under 30 requests/minute, you'll be blocked after 1,000 requests in a single day .

## 🚀 **How to Get Higher Limits**

If you need more, upgrade to the **Developer Tier** (free, just add a credit card):

| Tier | RPM | Daily Requests | Cost Discount |
|------|-----|----------------|----------------|
| Free | 30 | 1,000 | None |
| Developer | Up to 300 | Up to 10,000 | 25% off tokens  |

The Developer tier gives you roughly **10x higher rate limits** with no minimum spend — just add a card for verification .

## 💡 **Tips to Stay Within Limits**

1. **Keep prompts concise** — shorter prompts = fewer tokens
2. **Use prompt caching** — cached tokens don't count toward rate limits 
3. **Implement retry logic** for when you hit the 30 RPM cap
4. **For production use**, consider upgrading to Developer tier (still free, just add card)

For most small farming assistant applications, **1,000 requests/day is plenty** — that's about 40-50 users asking 20 questions each per day. If you need more, the Developer tier is the way to go! 🌾
