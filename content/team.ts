// The founders. Bios and photos are still to come from Vaibhav (PLAYBOOK "Content still needed").
// When a photo arrives, save it as /public/team/<file>.jpg and set `photo: '/team/<file>.jpg'`.
export type Person = {
  name: string
  role: string
  bio: string
  photo: string | null
  isPlaceholder: boolean
}

export const team: Person[] = [
  {
    name: 'Sunil Sharma',
    role: 'Co-founder',
    bio: '[PLACEHOLDER] A short bio of 60–80 words will go here.',
    photo: null,
    isPlaceholder: true,
  },
  {
    name: 'Tausif Khan',
    role: 'Co-founder',
    bio: '[PLACEHOLDER] A short bio of 60–80 words will go here.',
    photo: null,
    isPlaceholder: true,
  },
]
