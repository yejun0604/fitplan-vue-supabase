import { createClient } from 'npm:@supabase/supabase-js@2'


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',

  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',

  'Access-Control-Allow-Methods':
    'POST, OPTIONS'
}


Deno.serve(async request => {

  if (request.method === 'OPTIONS') {

    return new Response(
      'ok',
      {
        headers: corsHeaders
      }
    )

  }


  if (request.method !== 'POST') {

    return new Response(

      JSON.stringify({
        error: 'Method not allowed.'
      }),

      {
        status: 405,

        headers: {
          ...corsHeaders,

          'Content-Type':
            'application/json'
        }
      }

    )

  }


  try {

    const authorizationHeader =
      request.headers.get(
        'Authorization'
      )


    if (!authorizationHeader) {

      return new Response(

        JSON.stringify({
          error: 'You must be logged in.'
        }),

        {
          status: 401,

          headers: {
            ...corsHeaders,

            'Content-Type':
              'application/json'
          }
        }

      )

    }


    const supabaseUrl =
      Deno.env.get(
        'SUPABASE_URL'
      )


    const supabaseAnonKey =
      Deno.env.get(
        'SUPABASE_ANON_KEY'
      )


    const serviceRoleKey =
      Deno.env.get(
        'SUPABASE_SERVICE_ROLE_KEY'
      )


    if (
      !supabaseUrl
      ||
      !supabaseAnonKey
      ||
      !serviceRoleKey
    ) {

      throw new Error(
        'Missing Supabase environment variables.'
      )

    }


    const userClient = createClient(

      supabaseUrl,

      supabaseAnonKey,

      {

        global: {

          headers: {

            Authorization:
              authorizationHeader

          }

        },

        auth: {

          persistSession:
            false,

          autoRefreshToken:
            false

        }

      }

    )


    const {

      data: {
        user
      },

      error:
        userError

    } = await userClient
      .auth
      .getUser()


    if (
      userError
      ||
      !user
    ) {

      return new Response(

        JSON.stringify({
          error: 'Invalid user session.'
        }),

        {
          status: 401,

          headers: {
            ...corsHeaders,

            'Content-Type':
              'application/json'
          }
        }

      )

    }


    const adminClient = createClient(

      supabaseUrl,

      serviceRoleKey,

      {

        auth: {

          persistSession:
            false,

          autoRefreshToken:
            false

        }

      }

    )


    const {

      error:
        deleteError

    } = await adminClient
      .auth
      .admin
      .deleteUser(
        user.id
      )


    if (deleteError) {

      throw deleteError

    }


    return new Response(

      JSON.stringify({

        success:
          true

      }),

      {

        status:
          200,

        headers: {

          ...corsHeaders,

          'Content-Type':
            'application/json'

        }

      }

    )

  }

  catch (error) {

    console.error(

      'Delete account error:',

      error

    )


    return new Response(

      JSON.stringify({

        error:
          'Unable to delete account.'

      }),

      {

        status:
          500,

        headers: {

          ...corsHeaders,

          'Content-Type':
            'application/json'

        }

      }

    )

  }

})