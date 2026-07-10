import { supabase } from '../lib/supabase'

const MAX_WEEKS = 10


async function getCurrentUser() {

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()


  if (error) {
    throw error
  }


  if (!user) {
    throw new Error(
      'You must be logged in to track your weight.'
    )
  }


  return user
}


function getTodayDate() {

  const date = new Date()

  const timezoneOffset =
    date.getTimezoneOffset() * 60000


  return new Date(
    date.getTime() - timezoneOffset
  )
    .toISOString()
    .split('T')[0]
}


export async function getWeightTrackingData() {

  const user = await getCurrentUser()


  const [
    settingsResponse,
    entriesResponse
  ] = await Promise.all([

    supabase
      .from('weight_tracking_settings')
      .select('check_in_day')
      .eq('user_id', user.id)
      .limit(1),

    supabase
      .from('weight_entries')
      .select(`
        id,
        week_number,
        weight_kg,
        measured_on,
        created_at
      `)
      .eq('user_id', user.id)
      .order('week_number', {
        ascending: true
      })

  ])


  if (settingsResponse.error) {
    throw settingsResponse.error
  }


  if (entriesResponse.error) {
    throw entriesResponse.error
  }


  return {

    checkInDay:
      settingsResponse.data[0]
        ?.check_in_day ?? 1,

    weightEntries:
      entriesResponse.data

  }
}


export async function saveCheckInDay(
  checkInDay
) {

  const user = await getCurrentUser()


  const {
    error
  } = await supabase

    .from('weight_tracking_settings')

    .upsert(
      {
        user_id: user.id,
        check_in_day: checkInDay
      },
      {
        onConflict: 'user_id'
      }
    )


  if (error) {
    throw error
  }
}

export async function resetWeightProgress() {

  const user = await getCurrentUser()


  const {
    error: deleteError
  } = await supabase

    .from('weight_entries')

    .delete()

    .eq('user_id', user.id)


  if (deleteError) {
    throw deleteError
  }


  const {
    error: settingsError
  } = await supabase

    .from('weight_tracking_settings')

    .upsert(
      {
        user_id: user.id,
        check_in_day: 1
      },
      {
        onConflict: 'user_id'
      }
    )


  if (settingsError) {
    throw settingsError
  }

}


export async function addWeightEntry(
  weight
) {

  const user = await getCurrentUser()


  const {
    data: existingEntries,
    error: loadError
  } = await supabase

    .from('weight_entries')

    .select('week_number')

    .eq('user_id', user.id)

    .order('week_number', {
      ascending: false
    })

    .limit(1)


  if (loadError) {
    throw loadError
  }


  const latestWeek =
    existingEntries[0]
      ?.week_number ?? 0


  const nextWeek =
    latestWeek + 1


  if (nextWeek > MAX_WEEKS) {

    throw new Error(
      'You have completed all 10 weekly check-ins.'
    )

  }


  const {
    data,
    error
  } = await supabase

    .from('weight_entries')

    .insert({
      user_id: user.id,
      week_number: nextWeek,
      weight_kg: weight,
      measured_on: getTodayDate()
    })

    .select()

    .single()


  if (error) {
    throw error
  }


  return data
}