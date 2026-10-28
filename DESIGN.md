---
name: Gimnasio · Práctica 17
description: Sistema visual de gimnasio para consultar horarios, reservar y revisar inscripciones.
colors:
  primary: "#d5fa70"
  ink: "#17241d"
  accent-ink: "#192b12"
  neutral-bg: "#f1f2eb"
  surface: "#fffefa"
  muted: "#526057"
  line: "#cbd2c7"
  focus: "#397447"
  danger: "#8c282c"
  danger-bg: "#fff0ed"
  success: "#284b26"
  success-bg: "#edf7e6"
typography:
  display:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(3.1rem, 7.4vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.99
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(2.8rem, 6vw, 4.65rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
rounded:
  status: "6px"
  field: "8px"
  compact: "9px"
  button: "11px"
  panel: "15px"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
    padding: "0 21px"
    height: "52px"
  button-accent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.button}"
    padding: "0 21px"
    height: "52px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    padding: "0 16px"
    height: "42px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "51px"
  form-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(26px, 4vw, 42px)"
  enrollment-state:
    backgroundColor: "{colors.success-bg}"
    textColor: "#2d5226"
    rounded: "{rounded.status}"
    padding: "0 9px"
    height: "27px"
---

# Design System: Gimnasio Práctica 17

## Overview

**Creative North Star: "Ritmo en claro"**

“Ritmo en claro” describes the current interface: it gives class times, coaches, capacity, and the next action a plain, quick-to-scan order. A soft paper field and generous page margins keep the experience calm, while dark green ink gives headings and actions a strong anchor.

Práctica 17 extends the familiar account shell from Práctica 16 with open schedule and enrollment rows. Archivo Variable gives the headlines a firm voice; DM Sans Variable carries supporting copy, labels, and fields. The lime mark and action button add a small, high-visibility cue. At narrow widths, navigation gets its own row and class details stack above a full-width action.

**Key Characteristics:**
- Paper-colored pages with a warm white form surface and dark green ink.
- A single sharp lime accent for the wordmark mark, selection, and key form action.
- Large Archivo headlines paired with practical DM Sans interface text.
- Open, divider-separated schedule and enrollment lists with rounded controls.
- Responsive layouts that preserve links, details, and actions on small screens.

## Colors

The palette pairs a restrained green-gray foundation with one vivid lime signal and separate success and error states.

### Primary
- **Lime Signal** (#d5fa70): The main visual accent on the wordmark mark, selected text, and form submit action. Use dark accent ink over it.
- **Forest Ink** (#17241d): The dominant text color and the background for dark buttons.

### Neutral
- **Soft Paper** (#f1f2eb): The full-page background.
- **Warm Surface** (#fffefa): The form panel, fields, and dark-button text.
- **Muted Sage** (#526057): Supporting copy, secondary details, and account metadata.
- **Divider Sage** (#cbd2c7): Header and list separators.
- **Ink on Lime** (#192b12): Legible text on the bright accent.
- **Focus Green** (#397447): Keyboard-visible focus outline and focused field border.

### Semantic States
- **Error Brick** (#8c282c) on **Error Blush** (#fff0ed): API and form errors.
- **Success Green** (#284b26) on **Success Wash** (#edf7e6): Confirmed enrollment feedback.

**The Lime Signal Rule.** Keep lime as a brief marker for primary action and brand emphasis; place dark ink on lime instead of white.

## Typography

**Display Font:** Archivo Variable (with sans-serif fallback)
**Body Font:** DM Sans Variable (with sans-serif fallback)
**Character:** Archivo’s weight and close-set headlines give the schedule a confident anchor. DM Sans stays clear at small sizes in field labels, time details, and account metadata.

### Hierarchy
- **Display** (600, clamp(3.1rem, 7.4vw, 6rem), line-height 0.99): Landing and authentication headlines; tightly set at -0.035em.
- **Headline** (600, clamp(2.8rem, 6vw, 4.65rem), line-height 1): Schedule and enrollment page headings.
- **Title** (600, 1.55rem, line-height 1.15): Class names and enrollment titles; letter spacing -0.025em.
- **Body** (400, 1rem, line-height 1.55): Supporting information and schedule descriptions; some introductory copy expands to 1.13rem with a 1.65 line-height.
- **Label** (700, 0.9rem): Form labels. Schedule detail labels use 0.76rem and supporting details generally use 0.82–0.9rem.

**The Two-Font Rule.** Use Archivo Variable for headings and the small brand mark; use DM Sans Variable for body copy, labels, fields, and controls.

## Layout

The desktop content column is capped at 1200px and centered with 24px minimum side gutters. The header uses a fluid 24–96px horizontal inset and an 82px minimum height. Landing and authentication pages use two-column compositions; schedule rows use class, detail, and action columns, with detail fields arranged in a two-column definition list.

At 820px the schedule row reduces to two columns. At 680px the header wraps its navigation onto a separate row, page content narrows to at most 500px, and schedule details and actions stack beneath the class name. At 410px the page gutters and detail-column gaps tighten. Schedule and enrollment rows retain their separators and readable actions through the stack.

Vertical page insets use responsive values: schedule pages use 52–88px on wide screens and 48px on narrow screens. Schedule rows use about 25px vertical padding on wide screens and 22px on narrow screens. Internal spacing is component-specific rather than a separate global scale.

## Elevation & Depth

The interface is flat by default. No box shadows are defined in the stylesheet. Depth comes from the warm white form surface against the paper page, thin borders, and the lime or semantic state fills. The form panel is the one bounded container; schedule and enrollment lists remain open.

**The Open Schedule Rule.** Keep class and enrollment records in open rows with a 1px divider; do not turn each record into a separate card.

## Shapes

Controls use gently rounded corners: fields and messages use 8px, compact header controls 9px, standard buttons 11px, and the form panel 15px. Enrollment status uses a small 6px corner. Schedule and enrollment rows keep square, open edges and rely on their bottom divider rather than a surrounding card border.

## Components

### Buttons
Buttons feel direct and weighty, with a short lift on hover and a visible keyboard focus ring.

- **Shape:** Gently rounded at 11px; compact header buttons use 9px.
- **Primary:** Dark ink for schedule enrollment and general navigation actions; 52px minimum height with 21px horizontal padding.
- **Accent:** Lime with dark accent ink for the account form submit action.
- **Quiet:** Transparent with a divider-colored outline for secondary controls such as Salir.
- **Hover / Active:** The button lifts 1px on hover and returns to rest while pressed; each filled variant shifts to a slightly deeper color.
- **Focus / Disabled:** Keep the 3px green focus outline with a 3px offset. Disabled actions lower opacity and use a waiting cursor.

### Cards / Containers
The form panel is a single warm-white surface with a 1px sage border, a 15px radius, and responsive 26–42px padding. Schedule and enrollment rows do not use cards or shadows; their 1px separators carry the list structure.

### Inputs / Fields
Fields pair a bold DM Sans label with a warm-white input, a 1px muted border, 8px radius, and 51px minimum height. Hover darkens the border; focus shifts it to the focus green while retaining the visible outline. Error messages use a pale blush fill, brick text, and a light border.

### Navigation
The header keeps the lime G mark and tracked GIMNASIO wordmark at left, with familiar text links and compact buttons at right. On narrow screens the navigation wraps into its own row and aligns left. Links remain underlined, with a thicker underline on hover.

### Schedule Rows
A schedule record presents the class name and description beside a two-column detail list for time, coach, and capacity, followed by its enrollment action. At tablet width the action drops below the first two columns; on narrow screens details span the row and the action becomes full width. Loading, error, success, empty, and full-capacity messages stay close to the relevant schedule.

### Enrollment Rows
Enrollment history uses the same open divider-separated rhythm. The class and session details sit opposite the state and registration date on wide screens; on narrow screens those parts stack and align left.

### Status Chips
Confirmed enrollment uses a pale green fill and green text inside a short bordered chip. Cancelled status uses a quiet gray fill and text, keeping the same small radius and compact silhouette.

## Do's and Don'ts

### Do:
- **Do** use Archivo Variable for headings and the small brand mark, and DM Sans Variable for body copy, labels, fields, and controls.
- **Do** preserve at least 4.5:1 contrast for body text, as required by the direction contract.
- **Do** retain the 3px green keyboard focus outline and preserve all links and actions as the layout stacks.
- **Do** reserve lime for the wordmark mark, selection, and key action, with dark text over the lime.
- **Do** keep schedule and enrollment details readable in open rows with their bottom dividers.

### Don't:
- **Don't** place every schedule or enrollment row inside a separate card; the built lists use open rows.
- **Don't** use white text on the lime action; the implemented contrast pairing is dark accent ink on lime.
- **Don't** add new visual chrome that competes with the class, time, coach, capacity, and enrollment action.
