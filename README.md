# About:Blank Lab

A small, single-page explainer for how `about:blank` tabs work, with a launcher for opening any link inside one.

**Live page:** https://just-rice.github.io/about-blank-lab/

## What's on the page

- A plain-language explanation of what `about:blank` is and why the page that opens a blank tab is allowed to write into it.
- A launcher with three modes to compare: about:blank + frame, blob: page + frame, and a normal new tab.
- An honest breakdown of what the trick hides (the address bar) and what it doesn't (network traffic, extensions, the site itself).
- Why sites like Google and GitHub refuse to be shown in a frame (`X-Frame-Options` / `frame-ancestors`, which protect against clickjacking).
- An "inspect a blank tab" experiment that reads facts about a fresh about:blank tab from its opener.

Everything runs in the browser: one `index.html`, no build step, no server, no tracking.
