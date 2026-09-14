---
trigger: manual
description: PitchMint Design System & Styling Guidelines
---

# PitchMint Design System

Use this guide whenever you are asked to design, redesign, or style a page (like `/dashboard`) in this application. The goal is to ensure visual consistency with the new Landing Page and unified Auth pages.

## 1. Core Principles
- **DRY (Don't Repeat Yourself)**: Reuse existing utility classes (like `.btn-primary`) rather than manually rewriting complex Tailwind classes (like shadows, gradients, and hover states).
- **No Functional Changes**: When asked to redesign, ONLY change visual/styling aspects. Do not modify functionality, logic, state, or API calls unless explicitly instructed.
- **Glassmorphism & Depth**: The app heavily relies on dark blurred backgrounds, subtle noise/textures, and 3D effects on buttons rather than flat design or intense glowing shadows.

## 2. Color Palette & Backgrounds
- **Primary Background**: Use `#000000` for main page backgrounds. 
- **Card / Surface Background**: Use `bg-[#0a0a0a]/95 backdrop-blur-xl` or `bg-[#141414]` for cards and form containers.
- **Borders**: Keep borders subtle to separate dark elements. Use `border-white/5` or `border-white/10`.
- **Text Colors**: 
  - Primary text and headings: `text-white`
  - Secondary text, subtitles, and labels: `text-gray-400` or `text-gray-500`
- **Accents**: Primary accent is vibrant purple (`#5e17eb`, `#7c3aed`). 

## 3. Typography & Spacing
- **Font**: The application uses the `"Poppins", sans-serif` font globally.
- **Text Sizes**: Use compact text sizing for forms (`text-[11px]` to `text-[13px]`). For headings, use `text-[18px]` to `text-[24px]` with `font-semibold` or `font-bold` and `tracking-tight`.
- **Rounded Corners**:
  - Main cards and containers: `rounded-[20px]` or `rounded-2xl`
  - Buttons and Inputs: `rounded-xl` or `rounded-lg`

## 4. Components & Interactive Elements
- **Buttons**:
  - **NEVER** use glowing shadows (`animate-glow` or `shadow-[0_0_20px_...]`) for primary actions anymore.
  - **ALWAYS** use the `.btn-primary` or `.btn-secondary` classes defined in `index.css`. 
  - These classes automatically apply the 3D bottom border effect (`border-b-[4px] border-[#3904a6] hover:translate-y-[2px] hover:border-b-2 bg-[#5e17eb] hover:bg-[#4d10c7]`).
- **Inputs & Forms**:
  - Input base style: `bg-[#141414] border border-white/10 rounded-lg text-white placeholder-gray-500`
  - Focus state: `focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors`
  - Size: Use tight padding like `py-1.5 px-3` or `py-2 px-3` with `text-[12px]`.
- **Cards & Shadows**:
  - Use `shadow-[0_20px_40px_rgba(0,0,0,0.8)]` for main elevated containers (like Auth modals).

## 5. Animations & Transitions
- **Framer Motion**: Wrap main page containers and cards in `<motion.div>` for smooth entrance animations.
  - Entrance: `initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}`
- **Hover Effects**: Apply `transition-all duration-200` or `duration-300` on interactive elements. 

## 6. Implementation Checklist
When redesigning a page (e.g., `/dashboard`):
- [ ] Replace any old neon/glowing button classes with `.btn-primary` or `.btn-secondary`.
- [ ] Update background colors to the `#0a0a0a` / `#141414` palette.
- [ ] Ensure inputs match the dark unified input styling.
- [ ] Adjust padding and border radii to match the unified system (`rounded-[20px]` for cards).
- [ ] Add Framer Motion entrance animations.
- [ ] Verify that no business logic or state hooks were altered.