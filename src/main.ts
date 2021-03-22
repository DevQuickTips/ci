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

    let labels = octokit.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number
    })

    let body = ""

    labels.then(e => {
      for (let eKey in e) {
        body += eKey + "\n"
      }
    })

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
