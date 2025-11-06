import { getDatabaseService } from '~~/server/services/database.service'
import { getPasswordService } from '~~/server/services/password.service'
import { OrganizationMemberRole } from '@prisma/client'

export default defineNitroPlugin(async () => {
  console.log('Running create-admin-user plugin')
  const databaseService = getDatabaseService()
  const userModels = await databaseService.user.findMany()
  if (userModels.length === 0) {
    await databaseService.user.create({
      data: {
        username: 'admin',
        password: getPasswordService().hashPassword('admin'),
        organizationMemberships: {
          create: {
            role: OrganizationMemberRole.OWNER,
            organization: {
              create: {
                name: 'Default Organization'
              }
            }
          }
        }
      }
    })
    console.log(`Created admin user`)
  } else {
    console.log('Admin user already exists, skipping creation')
  }
})
