This is a [Next.js](https://nextjs.org) project using NextJS v16 and [Tailwind](https://tailwindcss.com/) for styles.

## Getting Started

First time setup is as simple as installing nodejs dependencies

```bash
npm install
```

Then to run a dev server locally with an in memory database that is reset when the server restarts, just do...

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages by modifying `page.tsx` files in the `src/app` folder. The page auto-updates as you edit the file.

## Security

We use JWTs to authenticate users, so locally it will use a hard coded dummy key, and a different key in deployed environments. All the auth functionality based on lichess oauth should work locally as well as deployed.

JWTs are checked in a middleware defined in the `src/proxy.tsx` file so that any routes that begin `/private` require a logged in member, and any routes that start `/admin` require a logged in member with admin rights. All other pages are public.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployed on Vercel

The repo is setup with git hooks that trigger a production deploy to https://www.sandybells.club on push (or PR merge) to main and trigger a deploy to https://dev.sandybells.club on push to any other branch (probably pushing develop makes sense here).

The dev deployment has it's own database so playing around with the deploy the check it's working correctly will not impact production.
