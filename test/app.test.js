import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jsonPatch from 'json-patch';
import app from '../app';

chai.use(chaiHttp);

let request = chai.request.agent(app);

describe('App', () => {
  it('should return token and user credentials for a valid request to the "/login" route', (done) => {
    const credentials = {
      username: 'MySimpleUsername',
      password: 'MyComplexPassword@1900'
    };
    request.post('/api/login')
      .send(credentials)
      .end((err, res) => {
        expect(res).status(200);
        expect(res.body.user.username).to.be.equal('MySimpleUsername');
        expect(res.body.user.password).to.be.equal('MyComplexPassword@1900');
        done();
      });
  });

  it('should return "Invalid Username or Password" if any login input is null or undefined for the "/login" route', (done) => {
    const credentials = {
      username: undefined,
      password: null
    };
    request.post('/api/login')
      .send(credentials)
      .end((err, res) => {
        expect(res).status(403);
        expect(res.text).to.be.equal('Invalid Username or Password');
        done();
      });
  });

  it('should return "Username and Password must be of STRING type" if any login input is not a string for the "/login" route', (done) => {
    const credentials = {
      username: [0],
      password: {a: 1}
    };
    request.post('/api/login')
      .send(credentials)
      .end((err, res) => {
        expect(res).status(403);
        expect(res.text).to.be.equal('Username and Password must be of STRING type');
        done();
      });
  });

  it('should return a patched JSON object for valid request to the "/patch" route', (done) => {
    const credentials = {
      username: 'MySimpleUsername',
      password: 'MyComplexPassword@1900'
    };

    const json = {
      jsonObject: '{foo: [1,3]}',
      patch: [{ op: 'add', path: '/', value: 2 }]
    };

    request.post('/api/login')
      .send(credentials)
      .end((err, loginResponse) => {
        request.post('/api/patch')
          .set('Authorization', loginResponse.body.token)
          .send(json)
          .end((err, patchResponse) => {
            const output = jsonPatch.apply(json.jsonObject, json.patch);
            expect(patchResponse.body.patchedJson).to.be.deep.equal(output);
            done();
          });
      });
  });

  it('should return "Invalid Patch." if the patch input for the "/patch" route is of invalid data type', (done) => {
    const credentials = {
      username: 'MySimpleUsername',
      password: 'MyComplexPassword@1900'
    };

    const json = {
      jsonObject: 'foo',
      patch: { op: 'add', path: '/', value: 2 }
    };

    request.post('/api/login')
      .send(credentials)
      .end((err, loginResponse) => {
        request.post('/api/patch')
          .set('Authorization', loginResponse.body.token)
          .send(json)
          .end((err, patchResponse) => {
            expect(patchResponse.text).to.be.equal('Invalid Patch.');
            done();
          });
      });
  });

  it('should return "Invalid Token." if an invalid token is sent to the "/patch" route', (done) => {
    const credentials = {
      username: 'MySimpleUsername',
      password: 'MyComplexPassword@1900'
    };

    const json = {
      jsonObject: { foo: [1, 3] },
      patch: [{ op: 'add', path: '/', value: 2 }]
    };

    request.post('/api/login')
      .send(credentials)
      .end(() => {
        request.post('/api/patch')
          .set('Authorization', 'INVALID_TOKEN')
          .send(json)
          .end((err, patchResponse) => {
            expect(patchResponse.text).to.be.equal('Invalid Token.');
            done();
          });
      });
  });

  it('should return TRUE for a fetch request to the "getThumbnail" route with a valid URL', (done) => {
    const credentials = {
      username: 'MySimpleUsername',
      password: 'MyComplexPassword@1900'
    };

    request.post('/api/login')
      .send(credentials)
      .end((err, loginResponse) => {
        request.post('/api/getThumbnail')
          .set('Authorization', loginResponse.body.token)
          .send({ url: 'https://avatars2.githubusercontent.com/u/19750988?s=460&v=4' })
          .end((err, res) => {
            expect(Buffer.isBuffer(res.body)).to.be.equal(true);
            done();
          });
      });
  });

  it('should return "Invalid Image URL was given" for a fetch request with a URL that does not get an Image file', (done) => {
    const credentials = {
      username: 'MySimpleUsername',
      password: 'MyComplexPassword@1900'
    };

    request.post('/api/login')
      .send(credentials)
      .end((err, loginResponse) => {
        request.post('/api/getThumbnail')
          .set('Authorization', loginResponse.body.token)
          .send({ url: 'https://avatars2.githubusercontent.com/u/19750988?s=460&v=4' })
          .end((err, res) => {
            expect(res).status(403);
            expect(res.text).to.be.equal('Invalid Image URL was given');
            done();
          });
      });
  });

  it('should return FALSE if an invalid URL is sent to the "/getThumbnail" route', (done) => {
    const credentials = {
      username: 'MySimpleUsername',
      password: 'MyComplexPassword@1900'
    };

    request.post('/api/login')
      .send(credentials)
      .end((err, loginResponse) => {
        request.post('/api/getThumbnail')
          .set('Authorization', loginResponse.body.token)
          .send({ url: 'INVALID_IMAGE_URL' })
          .end((err, res) => {
            expect(Buffer.isBuffer(res.body)).to.be.equal(false);
            done();
          });
      });
  });

  it('should fail with a 403 status if a NULL or UNDEFINED or INVALID_TOKEN is sent to the "/getThumbnail" route', (done) => {
    request.post('/api/getThumbnail')
      .set('Authorization', null)
      .send({ url: 'https://avatars2.githubusercontent.com/u/19750988?s=460&v=4' })
      .end((err, res) => {
        expect(res).status(403);
        done();
      });
  });
});
