---
layout: "../../layouts/BlogPost.astro"
title: "NGRX Beginnings"
description: "I've started using NGRX, redux for Angular, and I'm working on style strageties."
pubDate: "Feb 5 2022"
image: "/NGRX Lifecycle.png"
draft: true
---

NGRX is redux (RX) for angular (NG). The redux design pattern gives strict guidelines on how to manage state in your applications that can help manage complexity. However, beyond the barebones docs, and some scattered blog posts, I couldn't find a cohesive style strategy for NGRX that fully worked for me. So, I've decided to write this post with my first pass thoughts on how I'm managing new pages with NGRX.

# State
State can get complex quickly. In my Donation Engine app, I used several services with subjects to manage my state. This lead to a bit of spagetti code where one part of the code would trigger the subject to publish and several scattered subscribers would trigger in a not easy to understand way. In general, I ran into many situations where one thing needed to update state in several places in different ways. Because of this, my whole app was very tightly coupled, and changing one thing with the way a subject updated would break the app in novel and unexpected ways. 