export const brand = { name: 'Meridian', tagline: 'Intelligent Systems. Better Business.' }

const u = (id: string, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

// Swap any URL here. SmartImage falls back to a forest gradient if one fails to load.
export const images = {
  hero: u('photo-1486406146926-c627a92ad1ab'),
  whyUs: u('photo-1497366216548-37526070297c'),
}