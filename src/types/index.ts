export interface SkillType {
  id: string
  name: string
  icon: string
  category: string
  level: number
  order: number
  visible: boolean
}

export interface EducationType {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  description: string | null
  order: number
  visible: boolean
}

export interface ExperienceType {
  id: string
  company: string
  role: string
  location: string | null
  startDate: string
  endDate: string | null
  description: string | null
  current: boolean
  order: number
  visible: boolean
}

export interface ProjectType {
  id: string
  title: string
  description: string
  image: string | null
  link: string | null
  github: string | null
  techStack: string
  order: number
  visible: boolean
}

export interface AchievementType {
  id: string
  title: string
  description: string | null
  date: string | null
  icon: string
  order: number
  visible: boolean
}

export interface MessageType {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

export interface SectionLayoutType {
  id: string
  section: string
  order: number
  visible: boolean
  icon: string
  title: string
}

export interface ProfileType {
  name: string | null
  email: string | null
  image: string | null
  about: string | null
  title: string | null
  phone: string | null
  location: string | null
  socialGithub: string | null
  socialLinkedin: string | null
  socialTwitter: string | null
  socialWebsite: string | null
}
