import { supabase } from '../lib/supabase'


async function getCurrentUser() {

  const {
    data,
    error
  } = await supabase
    .auth
    .getUser()


  if (error) {
    throw error
  }


  if (!data.user) {

    throw new Error(
      'You must be signed in.'
    )

  }


  return data.user

}



// Get Push, Pull, Legs and Rest

export async function getWorkoutRoutines() {

  const {
    data,
    error
  } = await supabase

    .from(
      'workout_routines'
    )

    .select(`
      id,
      name,
      position,
      is_rest_day
    `)

    .order(
      'position',
      {
        ascending: true
      }
    )


  if (error) {
    throw error
  }


  return data

}



// Get exercises for Push, Pull or Legs

export async function getWorkoutExercises(

  routineName

) {

  const {
    data,
    error
  } = await supabase

    .from(
      'workout_exercises'
    )

    .select(`
      id,
      routine_name,
      exercise_name,
      exercise_order,
      target_sets
    `)

    .eq(
      'routine_name',
      routineName
    )

    .order(
      'exercise_order',
      {
        ascending: true
      }
    )


  if (error) {
    throw error
  }


  return data

}



// Get or create the logged-in user's progress

export async function
getOrCreateWorkoutProgress() {

  const user =
    await getCurrentUser()


  const {

    data: existingProgress,

    error: selectError

  } = await supabase

    .from(
      'user_workout_progress'
    )

    .select(`
      user_id,
      last_completed_day
    `)

    .eq(
      'user_id',
      user.id
    )

    .maybeSingle()


  if (selectError) {
    throw selectError
  }


  if (existingProgress) {

    return existingProgress

  }


  const {

    data: newProgress,

    error: insertError

  } = await supabase

    .from(
      'user_workout_progress'
    )

    .insert({

      user_id:
        user.id

    })

    .select(`
      user_id,
      last_completed_day
    `)

    .single()


  if (insertError) {
    throw insertError
  }


  return newProgress

}



// Get saved set checks for one Day

export async function getCompletedSets(

  dayNumber

) {

  const user =
    await getCurrentUser()


  const {
    data,
    error
  } = await supabase

    .from(
      'user_completed_sets'
    )

    .select(`
      workout_exercise_id,
      set_number
    `)

    .eq(
      'user_id',
      user.id
    )

    .eq(
      'day_number',
      dayNumber
    )


  if (error) {
    throw error
  }


  return data

}



// Save one checked set

export async function addCompletedSet({

  dayNumber,

  workoutExerciseId,

  setNumber

}) {

  const user =
    await getCurrentUser()


  const {
    error
  } = await supabase

    .from(
      'user_completed_sets'
    )

    .insert({

      user_id:
        user.id,

      day_number:
        dayNumber,

      workout_exercise_id:
        workoutExerciseId,

      set_number:
        setNumber

    })


  if (error) {
    throw error
  }

}



// Remove one checked set

export async function removeCompletedSet({

  dayNumber,

  workoutExerciseId,

  setNumber

}) {

  const user =
    await getCurrentUser()


  const {
    error
  } = await supabase

    .from(
      'user_completed_sets'
    )

    .delete()

    .eq(
      'user_id',
      user.id
    )

    .eq(
      'day_number',
      dayNumber
    )

    .eq(
      'workout_exercise_id',
      workoutExerciseId
    )

    .eq(
      'set_number',
      setNumber
    )


  if (error) {
    throw error
  }

}



// Finish the current Day

export async function completeWorkoutDay(

  dayNumber

) {

  const {
    data,
    error
  } = await supabase

    .rpc(

      'complete_workout_day',

      {

        p_day_number:
          dayNumber

      }

    )


  if (error) {
    throw error
  }


  return data

}



// Reset the current user's workout program

export async function resetWorkoutProgram() {

  const {
    data,
    error
  } = await supabase

    .rpc(
      'reset_workout_program'
    )


  if (error) {
    throw error
  }


  return data

}