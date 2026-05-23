export function getAdminConfig() {
  const username = import.meta.env.ADMIN_USERNAME;
  const password = import.meta.env.ADMIN_PASSWORD;
  const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
  const githubToken = import.meta.env.GITHUB_TOKEN;
  const githubRepo = import.meta.env.GITHUB_REPO ?? "eyalmoryosef/eyalmoryosef.com";
  const githubBranch = import.meta.env.GITHUB_BRANCH ?? "master";

  return {
    username,
    password,
    sessionSecret,
    githubToken,
    githubRepo,
    githubBranch,
    isAuthConfigured: Boolean(username && password && sessionSecret),
    isGitHubConfigured: Boolean(githubToken && githubRepo),
  };
}
