import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const context = github.context

    const {owner, repo} = context.issue
    const issue_number = context.issue.number

    const token = core.getInput('repo-token', {required: true})
    const octokit = github.getOctokit(token)
    core.debug(context.issue.number.toString())

    const labels = await octokit.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number
    })

    let body = ''

    for (const label in labels) {
      body += `${label}\n`
    }

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
