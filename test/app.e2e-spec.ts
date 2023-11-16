import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { MongoHandlerService } from "../src/mongo/mongo.service"
import * as pactum from 'pactum'
import { AuthDto } from "../src/auth/dto"
import { EditUserDto } from "../src/user/dto"

describe('App e2e', () => {
  let app: INestApplication
  let mongo: MongoHandlerService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      }),
    )
    await app.init()
    await app.listen(3000)

    mongo = app.get(MongoHandlerService)

    await mongo.cleanDB()

    pactum.request.setBaseUrl("http://localhost:3000")
  })

  afterAll(() => {
    app.close()
  })
  
  describe('Auth', () => {
    describe('Signup', () => {
      const dto: AuthDto = {
        username: "muhdsalm",
        password: "123"
      }

      it('should throw if email empty', () => {
        return pactum.spec().post("/auth/signup")
                .withBody({"username": "", "password": 123})
                .expectStatus(400)
      })

      it('should throw if password empty', () => {
        return pactum.spec().post("/auth/signup")
                .withBody({"username": "muhdsalm", "password": ""})
                .expectStatus(400)
      })

      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signup')
                .expectStatus(400)
      })

      it("Should signup", () => {
        return pactum.spec().post('/auth/signup')
                .withBody(dto).expectStatus(201)
      })
    })

    describe('Signin', () => {
      const dto: AuthDto = {
        username: "muhdsalm",
        password: "123"
      }

      it('should throw if email empty', () => {
        return pactum.spec().post("/auth/signin")
                .withBody({"username": "", "password": 123})
                .expectStatus(400)
      })

      it('should throw if password empty', () => {
        return pactum.spec().post("/auth/signin")
                .withBody({"username": "muhdsalm", "password": ""})
                .expectStatus(400)
      })

      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signin')
                .expectStatus(400)
      })

      it("should throw if user doesn't exist", () => {
        return pactum.spec().post('/auth/signin')
                .withBody({"username": "andy", "password": "123"})
                .expectStatus(403)
      })

      it('Should signin', () => {
        return pactum.spec().post('/auth/signin')
              .withBody(dto).expectStatus(200)
              .stores('userAT', "access_token")
      })
    })
  })

  describe('User', () => {

    const dto: EditUserDto = {username: "notMuhdsalm", password: "password"}

    describe('Get Me', () => {
      it("Should get current user", () => {
        return pactum.spec().get("/users/me")
        .withHeaders({
          Authorization: 'Bearer $S{userAT}'
        })
        .expectStatus(200)
      })
    })

    describe('Edit User', () => {
      it("Should edit user", () => {
        return pactum.spec().patch("/users/me")
        .withHeaders({
          Authorization: "Bearer $S{userAT}"
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.username)
      })
    })

    describe('View Polls', () => {})

  })

  describe('Poll', () => {

    describe('Create Poll', () => {})

    describe('Delete Poll', () => {})

    describe('Vote on Poll', () => {})

  })
})