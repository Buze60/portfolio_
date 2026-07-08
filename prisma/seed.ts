import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@portfolio.com' } })
  if (!existingAdmin) {
    const hashedPassword = await hash('admin123', 12)
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'admin@portfolio.com',
        password: hashedPassword,
        title: 'Full Stack Developer',
        about: 'I build exceptional digital experiences. Passionate about creating beautiful, functional, and user-friendly applications.',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        socialGithub: 'https://github.com',
        socialLinkedin: 'https://linkedin.com',
        socialTwitter: 'https://twitter.com',
        socialWebsite: 'https://example.com',
      },
    })
    console.log('Admin user created')
  }

  const sections = [
    { section: 'hero', order: 0, icon: 'User', title: 'Hero' },
    { section: 'skills', order: 1, icon: 'Code2', title: 'Skills' },
    { section: 'experience', order: 2, icon: 'Briefcase', title: 'Experience' },
    { section: 'education', order: 3, icon: 'GraduationCap', title: 'Education' },
    { section: 'projects', order: 4, icon: 'FolderGit2', title: 'Projects' },
    { section: 'achievements', order: 5, icon: 'Award', title: 'Achievements' },
    { section: 'contact', order: 6, icon: 'Mail', title: 'Contact' },
  ]

  for (const section of sections) {
    const existing = await prisma.sectionLayout.findUnique({ where: { section: section.section } })
    if (!existing) {
      await prisma.sectionLayout.create({ data: section })
    }
  }
  console.log('Default sections created')

  const existingSkills = await prisma.skill.count()
  if (existingSkills === 0) {
    const skills = [
      { name: 'JavaScript', icon: 'FileJson', category: 'Frontend', level: 90, order: 0 },
      { name: 'TypeScript', icon: 'FileType', category: 'Frontend', level: 85, order: 1 },
      { name: 'React', icon: 'Atom', category: 'Frontend', level: 90, order: 2 },
      { name: 'Next.js', icon: 'Globe', category: 'Frontend', level: 85, order: 3 },
      { name: 'Node.js', icon: 'Server', category: 'Backend', level: 80, order: 4 },
      { name: 'Python', icon: 'Terminal', category: 'Backend', level: 75, order: 5 },
      { name: 'PostgreSQL', icon: 'Database', category: 'Backend', level: 75, order: 6 },
      { name: 'Tailwind CSS', icon: 'Paintbrush', category: 'Frontend', level: 90, order: 7 },
      { name: 'Git', icon: 'GitBranch', category: 'Tools', level: 85, order: 8 },
      { name: 'Docker', icon: 'Container', category: 'Tools', level: 70, order: 9 },
    ]
    for (const skill of skills) {
      await prisma.skill.create({ data: skill })
    }
    console.log('Sample skills created')
  }

  const existingEducation = await prisma.education.count()
  if (existingEducation === 0) {
    const education = [
      { school: 'Stanford University', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2018', endDate: '2022', description: 'Graduated with honors. Focused on software engineering and artificial intelligence.', order: 0 },
    ]
    for (const edu of education) {
      await prisma.education.create({ data: edu })
    }
    console.log('Sample education created')
  }

  const existingExperience = await prisma.experience.count()
  if (existingExperience === 0) {
    const experiences = [
      { company: 'Tech Corp', role: 'Senior Frontend Developer', location: 'San Francisco, CA', startDate: '2022', endDate: null, description: 'Leading frontend development team building next-generation web applications. Implemented micro-frontend architecture that improved deployment speed by 60%.', current: true, order: 0 },
      { company: 'StartupXYZ', role: 'Full Stack Developer', location: 'Remote', startDate: '2020', endDate: '2022', description: 'Built and shipped multiple features for the core product. Reduced load times by 40% through code splitting and lazy loading.', current: false, order: 1 },
      { company: 'WebAgency', role: 'Junior Developer', location: 'New York, NY', startDate: '2019', endDate: '2020', description: 'Developed responsive websites and web applications for various clients using React and Node.js.', current: false, order: 2 },
    ]
    for (const exp of experiences) {
      await prisma.experience.create({ data: exp })
    }
    console.log('Sample experience created')
  }

  const existingProjects = await prisma.project.count()
  if (existingProjects === 0) {
    const projects = [
      { title: 'E-Commerce Platform', description: 'A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.', techStack: 'Next.js, Stripe, PostgreSQL, Redis', order: 0 },
      { title: 'Task Management App', description: 'Collaborative task management tool with real-time updates, drag-and-drop boards, and team analytics.', techStack: 'React, Node.js, Socket.io, MongoDB', order: 1 },
      { title: 'AI Content Generator', description: 'AI-powered content generation tool using GPT models with customizable templates and export options.', techStack: 'Python, FastAPI, React, OpenAI', order: 2 },
    ]
    for (const project of projects) {
      await prisma.project.create({ data: project })
    }
    console.log('Sample projects created')
  }

  const existingAchievements = await prisma.achievement.count()
  if (existingAchievements === 0) {
    const achievements = [
      { title: 'Best Developer Award 2024', description: 'Recognized for outstanding contributions to the company tech stack and mentoring junior developers.', date: '2024', icon: 'Trophy', order: 0 },
      { title: 'Open Source Contributor', description: 'Contributed to 10+ open source projects with over 500 merged PRs.', date: '2023', icon: 'GitMerge', order: 1 },
      { title: 'Hackathon Winner', description: 'First place at TechHacks 2023 for building an accessibility-focused education platform.', date: '2023', icon: 'Zap', order: 2 },
    ]
    for (const achievement of achievements) {
      await prisma.achievement.create({ data: achievement })
    }
    console.log('Sample achievements created')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
