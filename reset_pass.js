const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    'e50beb8a-9755-42ef-a644-54cf0b3f558b',
    { password: 'callioni890@' }
  )
  
  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Password reset successfully for callioniskate@gmail.com')
  }
}

run()
