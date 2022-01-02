/* eslint-disable no-magic-numbers */
import request from 'supertest'

import server from '../../../server'

describe('Java Sandbox Endpoints', () => {
  it('Execute successful "hello, world!" (no input)', async () => {
    const app = await request(server)
    const response = await app.post('/').send({
      lang: 'java',
      code: `
        class FarmaAlg {
          public static void main(String[] args) {
            String greeting = "hello";
            String name = "world";
            System.out.println(greeting + ", " + name + "!");
          }
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
      lang: 'java',
      code: `
        class FarmaAlg {
          public static void main(String[] args) {

            // missing semicolon
            System.out.println("hello, world!")
          }
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
      lang: 'java',
      code: `
        class FarmaAlg {
          public static void main(String[] args) {

            // dividing by zero
            double result = 5 / 0;
            System.out.println(result);
          }
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
      lang: 'java',
      params: [
        '5 3\nworld',
        '-7 10\nJosnei',
      ],
      code: `
        import java.util.Scanner;

        class FarmaAlg {
          public static void main(String[] args) throws Exception {
            try (Scanner scanner = new Scanner(System.in)) {
              int num1 = scanner.nextInt();
              int num2 = scanner.nextInt();
              int sum = num1 + num2;
              System.out.println(num1 + " + " + num2 + " should be " + sum);

              String name = scanner.next();
              System.out.println("hello, " + name + "!");
            } catch (Exception ex) {
              throw ex;
            }
          }
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
