/* eslint-disable no-magic-numbers */
import request from 'supertest'

import server from '../../../server'

describe('C Sandbox Endpoints', () => {
  it('Execute successful "hello, world!" (no input)', async () => {
    const app = await request(server)
    const response = await app.post('/').send({
      lang: 'c',
      code: `
        #include <stdio.h>

        int main()
        {
          char* greeting = "hello";
          char* name = "world";
          printf("%s, %s!\\n", greeting, name);

          return 0;
        }
      `,
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('COMPLETED')
    expect(response.body.comp_time).toBeGreaterThan(0)
    expect(response.body.result.output).toBe('hello, world!\n')
    expect(response.body.result.input).toBeNull() // as no input param was provided
    expect(response.body.result.status).toBe('SUCCESS')
    expect(response.body.result.exec_time).toBeGreaterThan(0)
    expect(response.body.result.exit_code).toBe(0)
  })

  it('Failed to compile (syntax error)', async () => {
    const app = await request(server)
    const response = await app.post('/').send({
      lang: 'c',
      code: `
        #include <stdio.h>

        int main()
        {
          printf("hello, world!\\n");

          // missing semicolon
          return 0
        }
      `,
    })

    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('result')
    expect(response.body.status).toBe('COMPILATION_ERROR')
    expect(response.body.comp_time).toBeGreaterThan(0)
  })

  it('Failed to execute (division by zero)', async () => {
    const app = await request(server)
    const response = await app.post('/').send({
      lang: 'c',
      code: `
        #include <stdio.h>

        int main()
        {
          // dividing by zero
          float v = 5 / 0;

          return 0;
        }
      `,
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('COMPLETED')
    expect(response.body.comp_time).toBeGreaterThan(0)
    expect(response.body.result).toHaveProperty('output')
    expect(response.body.result.input).toBeNull() // as no input param was provided
    expect(response.body.result.status).toBe('RUNTIME_ERROR')
    expect(response.body.result.exec_time).toBeGreaterThan(0)
    expect(response.body.result.exit_code).not.toBe(0)
  })

  it('Execute successful "hello, world!" (with input)', async () => {
    const app = await request(server)
    const response = await app.post('/').send({
      lang: 'c',
      params: [
        '5 3\nworld',
        '-7 10\nJosnei',
      ],
      code: `
        #include <stdio.h>

        int main()
        {
          int num1, num2;
          scanf("%d %d", &num1, &num2);
          printf("%d + %d should be %d\\n", num1, num2, num1 + num2);

          char str[255];
          scanf("%s", str);
          printf("hello, %s!\\n", str);

          return 0;
        }
      `,
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('COMPLETED')
    expect(response.body.comp_time).toBeGreaterThan(0)
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
