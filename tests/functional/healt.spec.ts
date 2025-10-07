import { test } from '@japa/runner'

test('Healt Check', async ({ client }) => {
  const response = await client.get('/health')

  response.assertStatus(200)
  response.assertBody({
    hello: 'world',
  })
})
