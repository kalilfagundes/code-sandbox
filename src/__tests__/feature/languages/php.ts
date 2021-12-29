/* eslint-disable no-magic-numbers */
import request from 'supertest'

import server from '../../../server'

describe('PHP Sandbox Endpoints', () => {
  it('Execute successful "hello, world!" (no input)', async () => {
    const app = await request(server)
    const response = await app.post('/').send({
      lang: 'php',
      code: `<?php

        $greeting = "hello";
        $name = "world";

        echo "{$greeting}, {$name}!\\n";
      `,
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('COMPLETED')
    expect(response.body.comp_time).toBeNull() // as PHP is not compilable
    expect(response.body.result.output).toBe('hello, world!\n')
    expect(response.body.result.input).toBeNull() // as no input param was provided
    expect(response.body.result.status).toBe('SUCCESS')
    expect(response.body.result.exec_time).toBeGreaterThan(0)
    expect(response.body.result.exit_code).toBe(0)
  })

  it('Failed to execute (syntax error)', async () => {
    const app = await request(server)
    const response = await app.post('/').send({
      lang: 'php',
      code: `<?php

        // missing semicolon
        echo "hello, world!\\n"
      `,
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('COMPLETED')
    expect(response.body.comp_time).toBeNull() // as PHP is not compilable
    expect(response.body.result).toHaveProperty('output')
    expect(response.body.result.input).toBeNull() // as no input param was provided
    expect(response.body.result.status).toBe('RUNTIME_ERROR')
    expect(response.body.result.exec_time).toBeGreaterThan(0)
    expect(response.body.result.exit_code).not.toBe(0)
  })

  it('Execute successful "hello, world!" (with input)', async () => {
    const app = await request(server)
    const response = await app.post('/').send({
      lang: 'php',
      params: [
        '5 3\nworld',
        '-7 10\nJosnei',
      ],
      code: `<?php

        function main() {
          $input = readline();
          [$num1, $num2] = explode(' ', $input);
          $sum = $num1 + $num2;
          echo "$num1 + $num2 should be $sum\\n";

          $input = readline();
          echo "hello, $input!\\n";
        }

        main();
      `,
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('COMPLETED')
    expect(response.body.comp_time).toBeNull() // as PHP is not compilable
    expect(response.body.result).toHaveLength(2)

    expect(response.body.result[0].output).toBe('5 + 3 should be 8\nhello, world!\n')
    expect(response.body.result[0].input).toBe('5 3\nworld')
    expect(response.body.result[0].status).toBe('SUCCESS')
    expect(response.body.result[0].exec_time).toBeGreaterThan(0)
    expect(response.body.result[0].exit_code).toBe(0)

    expect(response.body.result[1].output).toBe('-7 + 10 should be 3\nhello, Josnei!\n')
    expect(response.body.result[1].input).toBe('-7 10\nJosnei')
    expect(response.body.result[1].status).toBe('SUCCESS')
    expect(response.body.result[1].exec_time).toBeGreaterThan(0)
    expect(response.body.result[1].exit_code).toBe(0)
  })
})
