import { ServerlessReposModule } from './serverless-repos.module';

describe('ServerlessReposModule', () => {
  let serverlessReposModule: ServerlessReposModule;

  beforeEach(() => {
    serverlessReposModule = new ServerlessReposModule();
  });

  it('should create an instance', () => {
    expect(serverlessReposModule).toBeTruthy();
  });
});
