export default defineNitroPlugin(async () => {
  try {
    console.log('🔄 [Init] Triggering admin initialization task...')

    const result = await runTask('initAdmin')

    if (result.result === 'Success') {
      console.log('✅ [Init] Admin account initialized successfully.')
    }
    else if (result.result === 'Skipped') {
      console.log('ℹ️ [Init] Admin account already exists. Skipping.')
    }
    else {
      console.warn('⚠️ [Init] Admin initialization task returned unexpected result:', result)
    }
  }
  catch (error) {
    console.error('❌ [Init] Failed to initialize admin:', error)
  }
})
