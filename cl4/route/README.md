# v4 canonical-route fix for unpublished theme 210083414353 (AI Step Ahead v29)

backup-v29-before-route/ = exact v29 files before this change (MD5 verified against Shopify):
  theme.liquid b30f2d3b670931ffb35e0a825a6d9d0f · main-page.liquid 2463801475466070ae0730735c10c1ef
  aisa-boost.liquid 9cd2a0cb190d029f9d030f1c73a13c5a · aisa-hub.liquid d366be7c534e10463880927a27f93378

v29-new/ = files uploaded to v29:
  layout/theme.liquid      = v27 theme.liquid byte-for-byte inside an {% else %}, plus a guarded branch that renders
                             the v4 layout + section cl4-landing only for /pages/claude-arabic with the default template.
  sections/main-page.liquid = byte-identical to live v27 (71456bd1...), old aisa-claude-cro branch removed.
  sections/aisa-boost.liquid, sections/aisa-hub.liquid = live v27 bytes + bundle saving read from one snippet.
  snippets/aisa-bundle-discount.liquid = single source for the advertised two-book saving (400 cents).
