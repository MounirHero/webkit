# Unified WebKit Exploit — InsideMatrixDev

## Minimalist Design
- Black screen only
- Firmware detection
- Fixed progress bar 0-100%
- Scrolling exploit log
- Auto-run, auto-payload, auto-close
- No images, no animations, no buttons

## Firmware Support
- **1.00 – 5.50** → umtx2 (inline, no iframe)
- **7.00 – 12.00** → poopsploit (soniciso1) via hidden iframe + log bridge
- **12.00 – 12.70** → p2JB (soniciso1) via hidden iframe + log bridge

## Auto-Run
Page auto-detects firmware and starts automatically after 1 second.

## Auto-Payload
After jailbreak, automatically sends:
1. **ShadowMountPlus** (local `payload/` folder or GitHub)
2. **OnionHEN** (local `payload/` folder or GitHub)

Place ELF files in `payload/` to avoid CORS issues:
- `payload/shadowmountplus.elf`
- `payload/OnionHEN.elf`

## Auto-Close
Browser closes automatically after payloads are sent.

## File Structure
```
/
├── index.html          # Hub (black UI, progress bar, log, auto-run)
├── logo.jpg            # Your PS5 logo
├── ext/
│   ├── bridge.js       # Log bridge from iframe to parent
│   ├── poops.html      # Patched poopsploit chain
│   ├── p2jb.html       # Patched p2JB chain
│   ├── core.js, main.js, rop.js, syscalls.js, rop_slave.js
│   ├── 2.gif, 3.gif    # Required by chains (hidden)
│   └── ui/             # Payload menu images (hidden)
├── payload/            # Place ELF payloads here (optional)
└── ux/                 # Your existing umtx2 files
```

## Credits
- umtx2: abc, shahrilnet, n0llptr
- poops/p2jb: soniciso1
- elfldr: john-tornblom / ps5-payload-dev
- Page: InsideMatrixDev
