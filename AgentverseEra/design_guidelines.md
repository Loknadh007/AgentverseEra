# Agentverse: Autonomous AI Debugging Platform - Design Guidelines

## Design Approach
**Sophisticated Glassmorphism with 3D Depth**: Modern luxury aesthetic inspired by Linear's minimalism and Stripe's elegance, elevated with purple-rose gold palette and floating glass elements.

## Color Palette
- **Background**: Deep Charcoal (#1a1a1a) and Rich Black (#0f0f0f)
- **Primary**: Deep Purple (#8B5CF6) - buttons, highlights, active states
- **Secondary**: Rose Gold (#F472B6) - accents, gradients, secondary actions
- **Success**: Soft Purple (#A78BFA) - confirmations, additions
- **Error**: Deep Pink (#EC4899) - warnings, deletions
- **Text**: White (primary), Gray-300 (secondary), Gray-500 (tertiary)
- **Glass**: White/purple tints at 5-15% opacity with backdrop-blur-xl

## Pre-Loader Experience
Full-screen charcoal canvas with centered orchestration:
- **20 floating particle orbs** in purple-to-rose-gold gradient, slow orbital motion
- **3 concentric rotating rings** with purple glow trails, different rotation speeds
- **Center text**: "Initializing Agentverse..." with blur-to-focus reveal (2s transition)
- **Gradient color shift**: Purple → Rose Gold → Purple cycle (4s loop)
- **Typography**: Space Grotesk, font-semibold, text-2xl with subtle purple glow
- **Exit transition**: 1000ms fade with particle dispersion effect

## Layout Architecture: Bento Grid Dashboard

### Main Panel (65% Width)
Real-time chat interface with sophisticated depth:
- Message containers: charcoal background with 90% opacity glass effect
- Staggered entrance: Each message fades in with scale (0.95 → 1.0) over 400ms, 100ms delay between messages
- Agent avatars: Circular with purple-rose gold gradient borders, subtle pulse animation
- Code blocks: Syntax highlighting with purple/pink accent colors

### Side Panel (35% Width)
Three stacked glass cards with purple glow separation:
- **Bug Report Card**: JSON-style with purple keys, rose gold values, gradient header bar
- **Ranked Hypotheses**: 3 numbered cards with confidence meters (purple gradient fills)
- **Activity Log**: Terminal-style with timestamps, purple agent names, scrollable container

All cards use backdrop-blur-xl, bg-white/10, border with purple/20, and hover glow effect.

## Typography System
- **UI Font**: Space Grotesk for headers/interface
- **Body Font**: Inter for readable content
- **Code Font**: JetBrains Mono for terminal/code displays
- **Scale**: Headers (text-3xl/text-4xl, font-bold), Body (text-base/text-lg), Code (text-sm), Meta (text-xs, text-gray-400)

## Component Specifications

### Chat Messages
- **User messages**: Right-aligned, charcoal bg with rose gold accent glow on left border (3px)
- **Agent responses**: Left-aligned, glass containers with agent-specific purple shade borders
  - Empathy Agent: Light purple (#A78BFA) border
  - Diagnostic Agent: Deep purple (#8B5CF6) border
  - Execution Agent: Rose gold (#F472B6) border
- Agent icons with gradient backgrounds matching border colors

### Bug Report Card
Prominent glass card with purple gradient header:
- Syntax-highlighted JSON format
- Purple property names with rose gold string values
- Nested indentation with subtle connector lines
- Hover state: Lift with purple shadow glow (8px blur, 0 8px offset)

### Hypotheses Display
Vertical stack of 3 ranked cards:
- Each card: Glass effect with numbered badge (purple gradient circle)
- Confidence bar: Rose gold to purple gradient fill with percentage
- Expandable sections with smooth height transition (300ms)
- Hover: 3D scale (1.03) with purple glow

### Activity Log
Terminal-style scrolling feed:
- Timestamp format: [HH:MM:SS] in gray-500
- Agent names in purple with bold weight
- Action text in white with monospace
- Loading cursor: Blinking purple bar
- Auto-scroll with smooth behavior

### Code Diff Visualization
- **Additions**: Rose gold background tint (bg-pink-900/10) with pink-300 text, "+ " prefix
- **Deletions**: Purple background tint (bg-purple-900/10) with purple-300 text, "- " prefix
- Line numbers in gray-600, syntax highlighting with purple/pink palette
- Container with glass effect and subtle border

## Animations & 3D Effects

### Entrance Animations
- **Message Entry**: Fade-in + scale from 0.95 to 1.0 over 400ms with ease-out
- **Stagger Pattern**: 100ms delay between sequential elements
- **Card Reveals**: Slide-up 30px + fade-in over 500ms

### Hover States
- **Cards**: Scale 1.03 transform + purple glow shadow (0 8px 32px purple/30)
- **Buttons**: No background color change, maintain glass with subtle scale 1.02
- **Interactive Elements**: Purple glow intensifies on hover

### Micro-Interactions
- **Loading States**: Pulsing opacity (0.6 ↔ 1.0) with 1.5s cycle
- **Transitions**: All state changes use 300ms ease-out timing
- **Focus States**: Purple ring outline with 4px offset

## Spacing & Layout
- Container padding: p-8 for main areas, p-6 for cards
- Grid gaps: gap-6 in Bento layout
- Section spacing: space-y-6 between major blocks
- Card internal spacing: space-y-4

## Visual Effects
- **Glassmorphism Formula**: bg-white/10 + backdrop-blur-xl + border-white/15
- **Shadow Glows**: Purple/rose gold at 20-30% opacity, 24-32px blur radius
- **Gradient Overlays**: Subtle purple-to-transparent on card headers
- **Border Accents**: 1-2px solid with purple/30 or rose-gold/30

## Images
No hero images - this is a dashboard application. Visual interest derives from glassmorphism, gradients, particle effects, and sophisticated data visualization. Agent avatars use gradient backgrounds; no photographic imagery required.