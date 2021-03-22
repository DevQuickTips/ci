import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const context = github.context

    const token = core.getInput('repo-token', {required: true})
    const octokit = github.getOctokit(token)
    core.debug(context.issue.number.toString())

    await octokit.issues.createComment({
      owner: context.issue.owner,
      repo: context.issue.repo,
      issue_number: context.issue.number,
      body: 'Hello, World!'
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
