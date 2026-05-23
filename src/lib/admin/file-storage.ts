import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { getAdminConfig } from "./env";

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

function useGitHub(): boolean {
  const config = getAdminConfig();
  return Boolean(config.isGitHubConfigured && import.meta.env.PROD);
}

function localPath(repoPath: string): string {
  return path.join(process.cwd(), repoPath);
}

async function githubGet(repoPath: string): Promise<{ content: string; sha: string }> {
  const config = getAdminConfig();
  const [owner, repo] = config.githubRepo.split("/");
  const url = new URL(`https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`);
  url.searchParams.set("ref", config.githubBranch);

  const res = await fetch(url, {
    headers: {
      ...GITHUB_HEADERS,
      Authorization: `Bearer ${config.githubToken}`,
    },
  });

  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);

  const data = (await res.json()) as { content?: string; sha?: string };
  if (!data.content || !data.sha) throw new Error("Empty GitHub response");
  return { content: Buffer.from(data.content, "base64").toString("utf8"), sha: data.sha };
}

export async function readRepoFile(repoPath: string): Promise<string> {
  if (useGitHub()) return githubGet(repoPath).then((r) => r.content);
  return readFile(localPath(repoPath), "utf8");
}

export async function writeRepoFile(repoPath: string, content: string, message?: string): Promise<void> {
  if (useGitHub()) {
    await writeGitHub(repoPath, content, message ?? `admin: update ${repoPath}`);
    return;
  }

  const filePath = localPath(repoPath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

export async function deleteRepoFile(repoPath: string): Promise<void> {
  if (useGitHub()) {
    await deleteGitHub(repoPath);
    return;
  }

  await unlink(localPath(repoPath));
}

export async function repoFileExists(repoPath: string): Promise<boolean> {
  try {
    if (useGitHub()) {
      await githubGet(repoPath);
      return true;
    }
    await readFile(localPath(repoPath), "utf8");
    return true;
  } catch {
    return false;
  }
}

async function writeGitHub(repoPath: string, content: string, message: string): Promise<void> {
  const config = getAdminConfig();
  const [owner, repo] = config.githubRepo.split("/");
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;

  let sha: string | undefined;
  try {
    const existing = await githubGet(repoPath);
    sha = existing.sha;
  } catch {
    /* new file */
  }

  const putRes = await fetch(baseUrl, {
    method: "PUT",
    headers: {
      ...GITHUB_HEADERS,
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch: config.githubBranch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    throw new Error(`GitHub write failed: ${putRes.status} ${await putRes.text()}`);
  }
}

async function deleteGitHub(repoPath: string): Promise<void> {
  const config = getAdminConfig();
  const { sha } = await githubGet(repoPath);
  const [owner, repo] = config.githubRepo.split("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      ...GITHUB_HEADERS,
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `admin: delete ${repoPath}`,
      sha,
      branch: config.githubBranch,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub delete failed: ${res.status} ${await res.text()}`);
  }
}
