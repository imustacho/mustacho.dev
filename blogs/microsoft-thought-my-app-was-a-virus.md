---
id: microsoft-thought-my-app-was-a-virus
title: "Microsoft Thought My App Was a Virus"
excerpt: "I built my own offline file converter to solve a problem I was dealing with almost every day. Then Microsoft SmartScreen decided my app wasn't trusted."
date: "September 7, 2026"
readTime: "3 min read"
category: "Development"
---

# My First App Got Flagged as a Virus by Microsoft

I needed to find a solution to a **wrong file format problem** I was dealing with almost every day.

WebP files, in particular, were driving me crazy.

Eventually, I discovered online file converter websites. They worked, but they had two major problems: they required an internet connection, and they weren't exactly ideal for handling sensitive files.

So I decided to build my own **offline file converter**.

## Deciding to build an app

Thanks to AI, the coding and design process wasn't nearly as difficult as I expected.

The part that took me much longer was **figuring out the architecture**.

I had never built an application like this before, so I didn't really know what technologies I should use. After doing some research, I decided to go with **Tauri**.

There were a few reasons for that.

Tauri allowed me to build an application for Windows, Linux, and macOS. It even supported Android.

That was a huge advantage, both for me and for anyone who might eventually use the application.

The goal of the app itself was pretty simple:

> **Convert files without uploading them to the internet.**

Once I finished the project, I published it on GitHub.

## Everything was going great. Until...

I was really excited to share the app with my friends.

I sent it to them and basically said:

> "Try this out. Look what I made."

Then I ran into a problem I wasn't expecting at all.

**Microsoft SmartScreen.**

My friends were greeted with a security warning before the application even opened. Windows didn't recognize my application as trusted.

The reason?

My application **wasn't code-signed**.

At that point, I couldn't help but think:

> **Can you buy trust with money?**

Of course, the situation is more complicated than simply "pay for a certificate and become trusted." But as someone publishing their first application, that's certainly how it felt.

There was no malware.

There was just a small application I had built and published openly on GitHub.

But from Windows' perspective, it was still an **unknown application**.

## Getting onto the Microsoft Store

I wanted to distribute my application in a way that felt safe and trustworthy.

So I decided to package the application as an **`.msix`** and submit it to the Microsoft Store.

Honestly, I wasn't expecting it to get approved.

It was my first time publishing an application, and I wasn't even sure whether I would make it through the review process.

But then...

**It got approved.**

I was genuinely excited.

For the first time, it felt like the application I had built wasn't just another project sitting on my computer.

It was actually **published**.

And, strangely enough, I felt like a real developer for the first time.

## What did I learn from this project?

This project wasn't just about building a file converter.

I learned that there is a big difference between **building an application** and **actually distributing it to real users**.

I had to design the architecture, choose the technology, build the application, package it, publish it on GitHub, and eventually submit it to the Microsoft Store.

Every step was a new experience for me.

The SmartScreen issue especially taught me that getting an application to work is only part of the job.

**Distribution, security, signing, and building trust with users are all part of software development too.**

Maybe it wasn't a huge project.

But it was important to me.

Because for the first time, I experienced the entire journey of an application—from an idea all the way to **real users being able to install it**.

And I think that's going to change how I approach my future projects.

Instead of only asking:

> **"How do I build this?"**

I'll also be asking:

> **"How do I get this into people's hands properly?"**

---

## Thanks for reading!

This was one of the first applications I built, and I learned a lot throughout the process.

If you're curious, you can check out the source code on GitHub:

**[→ Check out the project on GitHub](YOUR_GITHUB_LINK)**

Thanks for reading, and see you in the next project! 👋
