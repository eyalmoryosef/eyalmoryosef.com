import {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET,
  GITHUB_TOKEN,
  GITHUB_REPO,
  GITHUB_BRANCH,
} from "astro:env/server";

export function getAdminConfig() {
  const username = ADMIN_USERNAME;
  const password = ADMIN_PASSWORD;
  const sessionSecret = ADMIN_SESSION_SECRET;
  const githubToken = GITHUB_TOKEN;
  const githubRepo = GITHUB_REPO ?? "eyalmoryosef/eyalmoryosef.com";
  const githubBranch = GITHUB_BRANCH ?? "master";

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
