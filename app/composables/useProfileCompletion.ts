import { computed } from 'vue'
import type { Profile } from '~/types/models'

export interface CompletionField {
  key: string
  label: string
  icon: string
  description: string
  completed: boolean
  required: boolean
}

const MOTIVATIONAL_MESSAGES: { threshold: number; message: string }[] = [
  { threshold: 100, message: "Your VoyageHub profile is fully ready for booking adventures 🌍" },
  { threshold: 80,  message: "Almost there! Just a few details left to unlock the full experience ✨" },
  { threshold: 60,  message: "Great progress! Your profile is shaping up nicely 🏖️" },
  { threshold: 50,  message: "Your travel profile is halfway ready ✈️" },
  { threshold: 30,  message: "Good start! Keep going to unlock personalized recommendations 🗺️" },
  { threshold: 0,   message: "Let's build your traveler identity — every detail helps 🧳" },
]

export function useProfileCompletion(profile: Readonly<ReturnType<typeof computed<Profile | null>>>) {

  const fields = computed<CompletionField[]>(() => {
    const p = profile.value

    const hasValue = (v: unknown): boolean => {
      if (v === null || v === undefined) return false
      if (typeof v === 'string') return v.trim().length > 0
      if (Array.isArray(v)) return v.length > 0
      return Boolean(v)
    }

    return [
      // ─── Auto-completed on signup ───
      {
        key: 'firstName',
        label: 'First Name',
        icon: 'badge',
        description: 'Your given name',
        completed: hasValue(p?.firstName),
        required: true,
      },
      {
        key: 'email',
        label: 'Email Address',
        icon: 'email',
        description: 'Verified account email',
        completed: hasValue(p?.email),
        required: true,
      },
      {
        key: 'password',
        label: 'Password',
        icon: 'lock',
        description: 'Account secured with password',
        completed: true, // always true — backend handles it
        required: true,
      },
      // ─── Additional fields ───
      {
        key: 'lastName',
        label: 'Last Name',
        icon: 'person',
        description: 'Add your surname',
        completed: hasValue(p?.lastName),
        required: false,
      },
      {
        key: 'photo',
        label: 'Profile Picture',
        icon: 'photo_camera',
        description: 'Upload a profile photo',
        completed: hasValue(p?.photo),
        required: false,
      },
      {
        key: 'phone',
        label: 'Phone Number',
        icon: 'phone',
        description: 'Add a contact number',
        completed: hasValue(p?.phone),
        required: false,
      },
      {
        key: 'dateOfBirth',
        label: 'Date of Birth',
        icon: 'cake',
        description: 'Your birth date',
        completed: hasValue(p?.dateOfBirth),
        required: false,
      },
      {
        key: 'passportNumber',
        label: 'Passport Info',
        icon: 'travel_explore',
        description: 'Passport number for bookings',
        completed: hasValue(p?.passportNumber),
        required: false,
      },
      {
        key: 'preferredDestinations',
        label: 'Preferred Destinations',
        icon: 'map',
        description: 'Where do you love to travel?',
        completed: hasValue(p?.preferredDestinations),
        required: false,
      },
      {
        key: 'travelPreferences',
        label: 'Travel Preferences',
        icon: 'tune',
        description: 'Luxury, adventure, beach…',
        completed: hasValue(p?.travelPreferences),
        required: false,
      },
      {
        key: 'paymentMethod',
        label: 'Payment Method',
        icon: 'credit_card',
        description: 'Save a payment method',
        completed: hasValue(p?.paymentMethod),
        required: false,
      },
      {
        key: 'bio',
        label: 'Bio / About Me',
        icon: 'edit_note',
        description: 'Tell the world about yourself',
        completed: hasValue(p?.bio),
        required: false,
      },
    ]
  })

  const completedCount = computed(() => fields.value.filter(f => f.completed).length)
  const totalCount     = computed(() => fields.value.length)

  const percentage = computed(() =>
    Math.round((completedCount.value / totalCount.value) * 100)
  )

  const missingFields = computed(() =>
    fields.value.filter(f => !f.completed && !f.required)
  )

  const motivationalMessage = computed(() => {
    const pct = percentage.value
    return (
      MOTIVATIONAL_MESSAGES.find(m => pct >= m.threshold)?.message ??
      MOTIVATIONAL_MESSAGES[MOTIVATIONAL_MESSAGES.length - 1].message
    )
  })

  /** CSS conic-gradient stroke offset for the SVG circle */
  const dashOffset = computed(() => {
    const circumference = 2 * Math.PI * 54 // r=54
    return circumference - (percentage.value / 100) * circumference
  })

  const circumference = 2 * Math.PI * 54

  return {
    fields,
    completedCount,
    totalCount,
    percentage,
    missingFields,
    motivationalMessage,
    dashOffset,
    circumference,
  }
}
