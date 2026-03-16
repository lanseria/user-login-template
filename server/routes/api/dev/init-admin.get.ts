import { env } from 'node:process'

export default defineEventHandler(async () => {
  if (env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: This endpoint is only available in development mode.',
    })
  }

  console.log('API trigger received for task: init:admin')

  try {
    const taskResult = await runTask('initAdmin')

    if (taskResult.result === 'Success') {
      return {
        statusCode: 200,
        message: 'Admin initialization task completed successfully.',
        details: 'Admin user has been created. Check server logs for credentials.',
      }
    }
    else if (taskResult.result === 'Skipped') {
      return {
        statusCode: 200,
        message: 'Admin initialization task was skipped.',
        details: 'An admin user already exists.',
      }
    }
    else {
      throw new Error('Task execution failed with an unknown result.')
    }
  }
  catch (error: any) {
    console.error('Error running init:admin task via API:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to run the admin initialization task.',
      data: {
        error: error.message,
      },
    })
  }
})
