# 3PS.llc — "The Operations Report" redesign

**Live preview:** https://smira-cyber.github.io/3ps-website/
**Repo:** https://github.com/smira-cyber/3ps-website (Pages serves `main`)

A complete static replacement for the Base44-hosted 3ps.llc — 13 pages, no build
step. Push to `main` and GitHub Pages redeploys automatically.

## Cutting over 3ps.llc (when ready — this changes production)

DNS for 3ps.llc is on Cloudflare. Two options:

**Option A — keep GitHub Pages (simplest):**
1. In the repo: Settings → Pages → Custom domain → `3ps.llc` (this adds the CNAME).
2. In Cloudflare DNS: replace the current A/CNAME for `3ps.llc` with
   `CNAME @ → smira-cyber.github.io` (flattened automatically) and
   `CNAME www → smira-cyber.github.io`; set to DNS-only or Proxied (either works;
   if Proxied, set SSL mode "Full").
3. Wait for the Pages certificate, then enforce HTTPS in repo settings.

**Option B — Cloudflare Pages (same repo):**
1. Cloudflare dashboard → Workers & Pages → Create → connect `3ps-website` repo
   (no build command, output dir `/`).
2. Add `3ps.llc` as the custom domain — DNS is already in the same account.

After cutover, the Base44 app can be retired/canceled. Until then, the live site
is untouched.

## Original concept notes

A redesigned homepage for **3ps.llc**, built to stand out from the generic AI-template
MSP aesthetic. Static HTML/CSS/JS, no build step.

## The current live site (for reference)

3ps.llc in production is a **Base44 app** ("3PS - Secure IT & AI Solutions",
app id `696eaacc08c4935eae51d512`). It's a clean but generic AI-built SaaS template:
dark navy hero with blue-gradient headline and *no visual* (empty space), blue pill
buttons, white card grids, 10-industry chip wall, bare stat cards (57% / 99.9% / 0 /
<15min), dark CTA panel, scroll-fade animations with large dead whitespace bands.
Notably, the "People. Process. Performance." brand story never appears on the homepage,
and four different CTA labels compete (Get Started / Start Baseline Assessment /
Request a Consultation / Book a Call).

The `CoWork/acp-oracle/` folder is an *older local draft* of a 3PS site — it is NOT
what's deployed. Real logo assets exist in the Base44 app's storage
(`3PSLogo-WhiteHorizontalRGB.png`, `3PSLogo-ColorEmpty3VerticalRGB.png`).

## View this redesign

```bash
node /Users/poof/Desktop/CoWork/3ps-redesign/server.js
# open http://localhost:8431
```

## The thesis

The live site's copy promises *"Proactive IT operations. Total visibility. Zero
surprises."* — but the design is interchangeable with ten thousand other AI-generated
IT sites, and the claims sit unsupported in bare stat cards. This redesign makes
**the design itself the proof**:

> Boring IT, beautifully run.

It looks like a meticulously typeset operations report — paper background, editorial
serif (Newsreader), monospace data labels (IBM Plex Mono), hairline rules, numbered
sections, figure captions, footnoted claims. Calm = competence.

## The five moves (vs. the live site)

1. **Niche down.** 10 industry chips → lead with **diagnostic labs & regulated
   healthcare** (the real, rare expertise: Mirth, HL7, LIS, instrument interfaces).
   Other regulated industries remain as a secondary tier.
2. **Anchor the hero with evidence.** The live hero is text floating in dark space.
   Here it's **Fig. 01 — an HL7 result-delivery schematic** with monitored checkpoints.
   A lab director recognizes their world in five seconds.
3. **Claims with receipts.** Bare stat cards → footnoted figures with methodology
   notes, plus the "Daily Operations Report" panel (honestly labeled representative).
4. **One funnel.** Four competing CTA labels → everything converges on the Baseline
   Assessment.
5. **Restore the brand story.** "People. Process. Performance." is absent from the
   live homepage; here it's section 07 with the pull quote ("We sell the absence of
   excitement") — plus a light editorial look nobody else in the category has.

## Files

```
index.html        ← the redesigned homepage (self-contained content)
assets/report.css ← the new design system
assets/report.js  ← minimal JS: scroll reveals, mobile nav, year
server.js         ← local preview server (port 8431)
```

## Paths to ship

The live site is Base44, so three options:

1. **Import as a new Base44 app** (safe, side-by-side): bundle this design into a
   single self-contained HTML and use Base44's "import design from URL" flow; then
   compare, iterate, and repoint the domain when satisfied.
2. **Restyle the existing app**: drive `edit_base44_app` with change requests that
   apply this design system (palette, type, sections) to the production app. Riskier —
   it edits the live site.
3. **Host the static files directly** (Netlify/Cloudflare Pages/S3) and point
   3ps.llc's DNS at it — this folder is deployable as-is once interior pages exist.

## ⚠️ Verify before publishing

- **Claims & footnotes.** The stats (99.9%, <15 min, 0 ransomware, 57%) are carried
  over from the live site; the footnote methodology lines are *templates* — make them
  true or change them. Same for "47/47 interfaces" in the sample report (labeled
  "representative").
- **Niche dial.** The hero leads labs-first. For broader positioning, swap the kicker
  and lede; the structure holds.
- **Logo.** This concept uses a typographic mark; swap in the real 3PS logo files from
  Base44 storage for production.
- **Footer links** reference interior pages (services.html, contact.html, …) that
  exist on the live Base44 site but not in this folder — they're the information
  architecture target, not working links here.
