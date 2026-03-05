import { db } from "@/server/db";
import { Octokit } from "octokit";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
};

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    // Parse owner and repo from GitHub URL
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1]?.replace('.git', '');

    if (!owner || !repo) {
        throw new Error('Invalid GitHub URL');
    }

    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo,
    });

    const sortedCommits = data.sort((a, b) => {
        const dateA = new Date(a.commit.author?.date ?? '').getTime();
        const dateB = new Date(b.commit.author?.date ?? '').getTime();
        return dateB - dateA;
    });

    return sortedCommits.slice(0, 15).map((commit) => ({
        commitHash: commit.sha,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? ""
    }));
};

export const pollCommits = async (projectId: string) => {
    const {project, githubUrl} = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    return unprocessedCommits
}
async function summariseCommit(githubUrl: string, commitHash: string) {
    
}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
            repoUrl: true
        }
    })
    if (!project?.repoUrl) {
        throw new Error('Project not found or repoUrl missing')
    }
    return {project, githubUrl: project?.repoUrl}
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId
        }
    })
    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits
}